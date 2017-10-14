import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Nav from './components/nav';
import Board from './components/board';
import ScoreKeeping from './components/scoreKeeping';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      board: {
        b: {
          1: {order: 1, clicked: false, drawn: false},
          2: {order: 2, clicked: false, drawn: false},
          5: {order: 3, clicked: false, drawn: false},
          4: {order: 4, clicked: false, drawn: false},
          3: {order: 5, clicked: false, drawn: false},
        },
        i: {
          6: {order: 1, clicked: false, drawn: false},
          7: {order: 2, clicked: false, drawn: false},
          8: {order: 3, clicked: false, drawn: false},
          9: {order: 4, clicked: false, drawn: false},
          10: {order: 5, clicked: false, drawn: false},
        },
        n: {
          11: {order: 1, clicked: false, drawn: false},
          12: {order: 2, clicked: false, drawn: false},
          13: {order: 3, clicked: false, drawn: false},
          14: {order: 4, clicked: false, drawn: false},
          15: {order: 5, clicked: false, drawn: false},
        },
        g: {
          16: {order: 1, clicked: false, drawn: false},
          17: {order: 2, clicked: false, drawn: false},
          18: {order: 3, clicked: false, drawn: false},
          19: {order: 4, clicked: false, drawn: false},
          20: {order: 5, clicked: false, drawn: false},
        },
        o: {
          21: {order: 1, clicked: false, drawn: false},
          22: {order: 2, clicked: false, drawn: false},
          23: {order: 3, clicked: false, drawn: false},
          24: {order: 4, clicked: false, drawn: false},
          25: {order: 5, clicked: false, drawn: false},
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
    this.clickSquare = this.clickSquare.bind(this);
    this.checkBingo = this.checkBingo.bind(this);
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
    if (num >= 20 && num <= 40) letter = 'i';
    if (num >= 40 && num <= 60) letter = 'n';
    if (num >= 60 && num <= 80) letter = 'g';
    if (num >= 80 && num <= 100) letter = 'o';

    let newState = Object.assign({}, this.state.board);
    newState[letter][num].drawn = true;
    this.setState({board: newState});
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
        if (arr[j][i][0] && arr[i][j][1]) currY++;
        if (currX == 5 || currY == 5) answer = true;
      }

      if (arr[i][i][0] && arr[i][i][1]) diag1++;
      if (arr[arr.length - 1 - i][i][0] && arr[arr.length - 1 - i][i][1]) diag2++;
    }
    
    if (diag1 == 5 || diag2 == 5) answer = true;
    
    console.log('answer is', answer);
  }

  render() {
    return (
      <div className='row'>
        <Nav handleAuth={this.props.handleAuth} />
        <ScoreKeeping val={'1'} drawn={this.state.drawn} />
        <Board board={this.state.board} onClick={this.clickSquare} checkBingo={this.checkBingo}/>
      </div>
    );
  }
}

Home.propTypes = {
  handleAuth: PropTypes.object.isRequired,
};

export default Home;
