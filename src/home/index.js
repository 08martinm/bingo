import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Nav from './components/nav';
import Board from './components/board';
import ScoreKeeping from './components/scoreKeeping';
import Modal from './components/modal';
import io from 'socket.io-client';
import axios from 'axios';
const socket = io();

class Home extends Component {
  constructor() {
    super();
    this.state = {
      buildingBoard: false,
      bgColor: 'rgb(100, 100, 100)',
      maxUsers: 2,
      showModal: false,
      private: false,
      gameMaster: false,
      won: null,
      currentBall: null,
      numUsers: 1,
      invalidAttempt: false,
      board: {
        b: {
          1: {order: 1, clicked: false, drawn: false},
          12: {order: 2, clicked: false, drawn: false},
          20: {order: 3, clicked: false, drawn: false},
          4: {order: 4, clicked: false, drawn: false},
          7: {order: 5, clicked: false, drawn: false},
        },
        i: {
          29: {order: 1, clicked: false, drawn: false},
          27: {order: 2, clicked: false, drawn: false},
          32: {order: 3, clicked: false, drawn: false},
          24: {order: 4, clicked: false, drawn: false},
          21: {order: 5, clicked: false, drawn: false},
        },
        n: {
          41: {order: 1, clicked: false, drawn: false},
          46: {order: 2, clicked: false, drawn: false},
          53: {order: 3, clicked: false, drawn: false},
          44: {order: 4, clicked: false, drawn: false},
          59: {order: 5, clicked: false, drawn: false},
        },
        g: {
          78: {order: 1, clicked: false, drawn: false},
          68: {order: 2, clicked: false, drawn: false},
          67: {order: 3, clicked: false, drawn: false},
          66: {order: 4, clicked: false, drawn: false},
          71: {order: 5, clicked: false, drawn: false},
        },
        o: {
          88: {order: 1, clicked: false, drawn: false},
          89: {order: 2, clicked: false, drawn: false},
          100: {order: 3, clicked: false, drawn: false},
          92: {order: 4, clicked: false, drawn: false},
          93: {order: 5, clicked: false, drawn: false},
        },
      },
      drawn: {
        b: new Array(20).fill(''),
        i: new Array(20).fill(''),
        n: new Array(20).fill(''),
        g: new Array(20).fill(''),
        o: new Array(20).fill(''),
      },
    };
    socket.on('new lottery ball', payload => this.updateFromSockets(payload));
    socket.on('resetting boards', () => this.resetBoard());
    socket.on('gameMaster', () => this.setGameMaster(true));
    socket.on('userCountUpdate', num => this.setNumUsers(num));
    socket.on('You all lost', () => this.lostGame());
    socket.on('initialize game', data => this.initialize(data));
    socket.on('this game is full', () => this.toggleModal());
    this.clickSquare = this.clickSquare.bind(this);
    this.checkBingo = this.checkBingo.bind(this);
    this.getNewBoard = this.getNewBoard.bind(this);
    this.resetBoard = this.resetBoard.bind(this);
    this.resetAllBoards = this.resetAllBoards.bind(this);
    this.drawLotteryBall = this.drawLotteryBall.bind(this);
    this.setGameMaster = this.setGameMaster.bind(this);
    this.setNumUsers = this.setNumUsers.bind(this);
    this.lostGame = this.lostGame.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.changeTheme = this.changeTheme.bind(this);
    this.newBoardCb = this.newBoardCb.bind(this);
  }

  componentDidMount() {
    let urlArr = window.location.href.split('/');
    let roomName = urlArr[urlArr.length - 1];
    this.setState({roomName: roomName});
    socket.emit('join', roomName);
    let self = this;
    window.addEventListener('beforeunload', self.reconnectSocket);
    this.changeTheme();
  }

  componentWillUnmount() {
    socket.emit('leave', this.state.roomName);
    window.removeEventListener('beforeunload', this.reconnectSocket);
  }

  reconnectSocket() {
    socket.emit('leave', this.state.roomName);
  }

  changeTheme() {
    let r = Math.ceil(Math.random() * 255);
    let g = Math.ceil(Math.random() * 255);
    let b = Math.ceil(Math.random() * 255);
    this.setState({bgColor: 'rgb(' + r + ',' + g + ',' + b + ')'});
  }

  initialize(data) {
    console.log('initializing game and data is', data);
    let letter = '';
    let newArr = [];
    for (let i = 0; i < data.drawnBalls.length; i++) {
      if (data.drawnBalls[i] <= 20) letter = 'b';
      else if (data.drawnBalls[i] <= 40) letter = 'i';
      else if (data.drawnBalls[i] <= 60) letter = 'n';
      else if (data.drawnBalls[i] <= 80) letter = 'g';
      else if (data.drawnBalls[i] <= 100) letter = 'o';

      let ball = {
        letter: letter,
        number: data.drawnBalls[i],
      };

      newArr.push(ball);
    }
    
    newArr.forEach(obj => {
      this.updateFromSockets(obj);
    });

    this.setState({maxUsers: data.maxUsers, private: data.private, numUsers: data.numUsers});
  }

  toggleModal() {
    console.log('this game is full');
    this.setState({showModal: true});
  }

  setGameMaster(bool) {
    this.setState({gameMaster: bool});
  }

  setNumUsers(num) {
    this.setState({numUsers: num});
  }

  lostGame() {
    this.setState({won: false});
  }

  updateFromSockets(payload) {
    //update drawn
    let newDrawnArr = this.state.drawn[payload.letter].slice();
    newDrawnArr[(payload.number-1) % 20] = payload.number;
    let newObj = Object.assign({}, this.state.drawn);
    newObj[payload.letter] = newDrawnArr;
    this.setState({drawn: newObj});

    //update board
    this.updateDrawn(payload.number);

    //update current
    this.setState({currentBall: payload.letter + payload.number});
  }

  drawLotteryBall() {
    let availableNums = [];
    Object.keys(this.state.drawn).forEach((letter, letterNum) => {
      this.state.drawn[letter].forEach((val, key) => {
        if (val == '') {
          availableNums.push((key + 1) + 20*letterNum);
        }
      });
    });

    let num = availableNums[Math.floor(Math.random() * availableNums.length)];
    let letter = 'b';
    if (num >= 21 && num <= 40) letter = 'i';
    if (num >= 41 && num <= 60) letter = 'n';
    if (num >= 61 && num <= 80) letter = 'g';
    if (num >= 81 && num <= 100) letter = 'o';
    let data = {letter: letter, number: num};
    socket.emit('draw lottery ball', data, this.state.roomName);
  }

  clickSquare(evt) {
    let num = evt.target.innerHTML;
    let letter = evt.target.className.split(' ')[1].split('-')[1][0];
    let newState = Object.assign({}, this.state.board);
    newState[letter][num].clicked = !newState[letter][num].clicked;
    this.setState({board: newState});
  }

  updateDrawn(num) {
    let letter = 'b';
    if (num > 20 && num <= 40) letter = 'i';
    if (num > 40 && num <= 60) letter = 'n';
    if (num > 60 && num <= 80) letter = 'g';
    if (num > 80 && num <= 100) letter = 'o';

    if (this.state.board[letter].hasOwnProperty(num)) {
      let newState = Object.assign({}, this.state.board);
      newState[letter][num].drawn = true;
      this.setState({board: newState});
    }
  }

  resetAllBoards() {
    socket.emit('reset all boards', this.state.roomName);
  }
  
  resetBoard() {
    let newDrawn = Object.assign({}, this.state.drawn);
    Object.keys(newDrawn).forEach(key => {
      newDrawn[key] = new Array(20).fill('');
    });
    this.setState({drawn: newDrawn});

    let newBoard = Object.assign({}, this.state.board);
    'bingo'.split('').forEach(letter => {
      let currObj = newBoard[letter];
      Object.keys(currObj).forEach(key => {
        newBoard[letter][key].drawn = false;
        newBoard[letter][key].clicked = false;
      });
    });
    this.setState({board: newBoard, currentBall: null, invalidAttempt: false, won: null});
  }

  checkBingo() {
    let arr = [];
    let board = this.state.board;
    'bingo'.split('').forEach(letter => {
      let sortedRow = Object.keys(board[letter]).sort((key1, key2) => board[letter][key1].order - board[letter][key2].order);
      let currRow = [];
      sortedRow.forEach(numKey => currRow.push([board[letter][numKey].clicked, board[letter][numKey].drawn]));
      arr.push(currRow);
    });

    var answer = false;
    var diag1 = 0;
    var diag2 = 0;
    for (let i = 0; i <= 4; i++) {
      let currX = 0;
      let currY = 0;

      for (let j = 0; j <= 4; j++) {
        if (arr[i][j][0] && arr[i][j][1]) currX++;
        if (arr[j][i][0] && arr[j][i][1]) currY++;
        if (currX == 5 || currY == 5) {
          answer = true;
        }
      }

      if (arr[i][i][0] && arr[i][i][1]) {
        diag1++;
      }
      if (arr[arr.length - 1 - i][i][0] && arr[arr.length - 1 - i][i][1]) {
        diag2++;
      }
    }
    
    if (diag1 == 5 || diag2 == 5) answer = true;
    if (answer) {
      this.setState({won: answer, invalidAttempt: false});
      socket.emit('I won, suckers', this.state.roomName);
    } else {
      this.setState({invalidAttempt: true});
      let cb = () => this.setState({invalidAttempt: false});
      cb.bind(this);
      setTimeout(() => cb(), 2000);
    }

  }

  getNewBoard(arr, cb) {
    if (!arr) {
      console.log('initial call to getNewBoard');
      arr = [];
      this.setState({buildingBoard: true});
    }
    let self = this;
    let min = arr.length == 0 ? 1 : Math.floor(arr.length / 5) * 20 + 1; 
    let max = min + 19;

    axios.get('https://www.random.org/integers/?num=1&min=' + min + '&max=' + max + '&col=1&base=10&format=plain&rnd=new')
      .then(obj => {
        console.log('random.org obj.data is', obj.data, 'arguments are', arguments);
        if (!arr.includes(obj.data)) {
          arr.push(obj.data);
          if (arr.length == 25) return cb(arr);
        }
        self.getNewBoard(arr, self.newBoardCb);
      })
      .catch(error => console.log(error));
  }

  newBoardCb(newNums) {
    this.setState({buildingBoard: false});
    let newBoard = {};
    'bingo'.split('').forEach((letter, charNum) => {
      newBoard[letter] = {};
      for (let i = 1; i <= 5; i++) {
        newBoard[letter][newNums[i + charNum*5 - 1]] = {
          order: i,
          clicked: false,
          drawn: this.state.drawn[letter][(newNums[i + charNum*5 - 1] - 1) % 20] != '',
        };
      }
    });

    this.setState({board: newBoard});
  }

  render() {
    return (
      <div className='row'>
        <Nav bgColor={this.state.bgColor} handleAuth={this.props.handleAuth}/>

        <ScoreKeeping
          bgColor={this.state.bgColor}
          current={this.state.currentBall}
          drawn={this.state.drawn}
          numUsers={this.state.numUsers}
          val={'1'}
        />

        <Board
          bgColor={this.state.bgColor}
          board={this.state.board}
          changeTheme={this.changeTheme}
          checkBingo={this.checkBingo}
          drawLotteryBall={this.drawLotteryBall}
          gameMaster={this.state.gameMaster}
          handleAuth={this.props.handleAuth}
          invalidAttempt={this.state.invalidAttempt}
          newBoard={this.getNewBoard}
          onClick={this.clickSquare}
          resetBoard={this.resetAllBoards}
          won={this.state.won}
        />

        <Modal show={this.state.buildingBoard}>
          <div className='text-center'>
            <h3>
              Building new board...<br/>
              ...hold on tight!<br/><br/>
            </h3>
            <i className='center-block fa fa-spinner fa-pulse fa-3x fa-fw'></i>
          </div>
        </Modal>
      </div>
    );
  }
}

Home.propTypes = {
  handleAuth: PropTypes.object.isRequired,
};

export default Home;
