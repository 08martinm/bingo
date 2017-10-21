import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Nav from './components/nav';
import Modal from './components/modal';
import styles from './roomSelector.scss';
import { Link, withRouter } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io();

class RoomSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      nextRoom: 1,
      showModal: false,
    };
    socket.on('game created', newRoom => this.routeToNewRoom(newRoom));
    this.updateRoomsAndUsers = this.updateRoomsAndUsers.bind(this);
    this.getNextRoom = this.getNextRoom.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.routeToNewRoom = this.routeToNewRoom.bind(this);
  }

  componentDidMount() {
    socket.on('update rooms and users', newState => this.updateRoomsAndUsers(newState));
    socket.emit('get rooms and users');
  }

  updateRoomsAndUsers(newState) {
    let newGames = [];
    Object.keys(newState).forEach(keyName => {
      newGames.push({room: keyName, number: newState[keyName]});
    });
    this.setState({games: newGames});
    this.getNextRoom();
  }

  getNextRoom()  {
    let rooms = {};
    this.state.games.forEach(obj => rooms[obj.room] = true);
    let i = 1;
    while (rooms.hasOwnProperty('Room #' + i)) {
      i++;
    }
    this.setState({nextRoom: i});
  }

  toggleModal(evt) {
    evt.stopPropagation();
    let id = evt.target.id;
    if (id == 'modal-backdrop' || id == 'modal-close' || id == 'create-game') {
      this.setState({showModal: !this.state.showModal});
    }
  }

  createGame(obj) {
    console.log('about to create a new room');
    socket.emit('create new room', obj);
  }

  routeToNewRoom(newRoom) {
    console.log('pushing to new room', newRoom);
    this.props.history.push('/room/' + newRoom);
  }

  render() {
    return (
      <div className={`row ${styles.container}`}>
        <Nav handleAuth={this.props.handleAuth} />

        <div className={`jumbotron text-center ${styles.pic}`}>
          <div className={`${styles.jumbotrontext}`}>
            <h1 className='display-3'>Hello, friend!</h1>
            <div className={`${styles.line}`} />
            <p className='lead'>
              Welcome to BingoByMatthew.<br/>
              Start by clicking on a game below,<br/>
              or creating a new one.
            </p>
          </div>
        </div>

        <div className={`${styles.gamelist} text-center`}>
          <h3 className={styles.title}>Games available</h3>
          <div className='list-group'>
            {this.state.games.map((game, key) => <GameContainer key={key} game={game} />)}
            <div className={`list-group-item active ${styles.gamecontainer}`}>
              <div onClick={e => this.toggleModal(e)}>
                <div id='create-game' className={`${styles.create}`}>
                  Create new Game (Room #{this.state.nextRoom})
                </div>
              </div>
              <GameModal show={this.state.showModal} toggleModal={this.toggleModal} nextRoom={this.state.nextRoom} games={this.state.games} createGame={this.createGame}/>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

RoomSelector.propTypes = {
  handleAuth: PropTypes.object.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(RoomSelector);

let GameContainer = props => {
  return (
    <Link to={'/room/' + props.game.room}>
      <div className={`list-group-item ${styles.gamecontainer}`}>
        <div className={`${styles.item1}`}>{props.game.room}</div>
        <div className={`${styles.item2}`}><i className={`fa fa-users ${styles.icon}`} aria-hidden='true' />{props.game.number}</div>
      </div>
    </Link>
  );
};

GameContainer.propTypes = {
  game: PropTypes.object.isRequired,
};

class GameModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      private: false,
      roomName: '',
      roomNum: 15,
      roomPassword: '',
      roomConfPassword: '',
      errMsgs: [],
    };
    this.togglePrivate = this.togglePrivate.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  togglePrivate() {
    console.log('evt fired in togglePrivate');
    this.setState({private: !this.state.private});
  }

  closeModal(evt) {
    evt.stopPropagation();
    let id = evt.target.id;
    if (id == 'modal-backdrop' || id == 'modal-close' || id == 'create-game') {
      console.log('evt fired in closeModal');
      this.setState({private: false, errMsgs: [], roomName: '', roomNum: 50, roomPassword: '', roomConfPassword: ''});
      this.props.toggleModal(evt);
    }
  }

  onSubmit(evt) {
    evt.preventDefault();
    let errMsgs = [];
    if (this.state.private && (this.state.roomConfPassword != this.state.roomPassword)) {
      errMsgs.push('Password and Confirm Password must match');
    }

    if (this.state.private && (this.state.roomPassword.length < 4 || this.state.roomPassword.length >= 25)) {
      errMsgs.push('Password must be between 5 and 25 characters');
    }

    let myRe = /^[a-z0-9_]+$/i;
    if (!myRe.exec(this.state.roomName)) {
      errMsgs.push('Room name may only contain alphanumeric characters and underscores');
    }

    console.log('roomName is', this.state.roomName, 'and games is', this.props.games, 'reduce is', this.props.games.reduce((curr, obj) => curr || (obj.room == this.state.roomName), false));
    if (this.props.games.reduce((curr, obj) => curr || (obj.room === this.state.roomName), false)) {
      errMsgs.push('Hmmm... it appears that room name has already been taken!');
    }

    if (this.state.roomName.length <= 4 || this.state.roomName.length >= 25) {
      errMsgs.push('Room name must be between 4 and 25 characters');
    }

    if (this.state.roomNum <= 0 || this.state.roomNum > 100) {
      errMsgs.push('The maximum number of players must be between 1 and 100');
    }

    if (errMsgs.length > 0) {
      this.setState({errMsgs: errMsgs});
    } else {
      this.setState({errMsgs: []});
      let newGame = {};
      newGame.maxUsers = +this.state.roomNum;
      newGame.room = this.state.roomName;
      newGame.private = this.state.private;
      if (this.state.private) {
        newGame.roomPassword = this.state.roomPassword;
      }

      this.props.createGame(newGame);
    }
  }

  onChange(evt) {
    evt.stopPropagation();
    let newState = {};
    newState[evt.target.id] = evt.target.value;
    this.setState(newState);
  }

  render() {
    return (
      <Modal show={this.props.show} onClose={e => this.closeModal(e)}>
        <form onSubmit={e => this.onSubmit(e)} className={`${styles.gamemodal}`}>
          <div className='form-group'>
            <label htmlFor='roomName'>Room Name</label>
            <input type='text' className='form-control' id='roomName' aria-describedby='roomName' placeholder='Room Name' onChange={evt => this.onChange(evt)}/>
          </div>
          <div className='form-group'>
            <label htmlFor='roomName'>Set Max Players:</label>
            <input type='number' min='1' max='100' className={`form-control ${styles.specific} ${styles.roomnumber}`} id='roomNum' aria-describedby='roomNumber' defaultValue='15' onChange={evt => this.onChange(evt)}/>
          </div>
          <div className='form-check'>
            <label className='form-check-label'>
              <input type='checkbox' className={`${styles.checkbox} form-check-input`} onClick={() => this.togglePrivate()}/>
              <div className={`${styles.checkboxtext}`}>Make game private? (requires password to join)</div>
            </label>
          </div>
          {this.state.private && (
            <div>
              <div className='form-group'>
                <label htmlFor='roomPassword'>Password</label>
                <input type='password' className='form-control' id='roomPassword' placeholder='Password' onChange={evt => this.onChange(evt)}/>
              </div>
              <div className='form-group disabled'>
                <label htmlFor='roomConfPassword'>Confirm Password</label>
                <input type='password' className='form-control' id='roomConfPassword' placeholder='Confirm Password' onChange={evt => this.onChange(evt)}/>
              </div>
            </div>
          )}
          <div className={`${styles.footer}`}>
            <button type='submit' className={`${styles.width} btn btn-primary`} onClick={this.onSubmit}>
              Create Game!
            </button>
            <button id='modal-close' className={`${styles.width} btn btn-danger`}>Cancel</button>
          </div>
          {this.state.errMsgs.length > 0 &&
            <div>
              {this.state.errMsgs.map((val, key) => (
                <div key={key} className='alert alert-danger'>
                  {val}
                </div>
              ))}
            </div>
          }
        </form>
      </Modal>
    );
  }
}

GameModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  nextRoom: PropTypes.number.isRequired,
  games: PropTypes.array.isRequired,
  createGame: PropTypes.func.isRequired,
};
