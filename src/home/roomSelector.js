import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Nav from './components/nav';
import Modal from './components/modal';
import styles from './roomSelector.scss';
import { Link } from 'react-router-dom';
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
    this.updateRoomsAndUsers = this.updateRoomsAndUsers.bind(this);
    this.getNextRoom = this.getNextRoom.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
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
              <GameModal show={this.state.showModal} toggleModal={this.toggleModal} nextRoom={this.state.nextRoom}/>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

RoomSelector.propTypes = {
  handleAuth: PropTypes.object.isRequired,
};

export default RoomSelector;

let GameContainer = props => {
  return (
    <Link to={'/room/' + +props.game.room.slice(6)}>
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
      roomNum: 1,
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
      this.setState({private: false, errMsgs: []});
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

    let myRe = /^[a-z0-9]+$/i;
    if (this.state.roomName === myRe.exec(this.state.roomName)) {
      errMsgs.push('Room name may only contain alphanumeric characters');
    }

    if (this.state.roomName.length <= 4 || this.state.roomName.length >= 25) {
      errMsgs.push('Room name must be between 4 and 25 characters');
    }

    if (this.state.roomNum <= 0 || this.state.roomNum > 100) {
      errMsgs.push('The maximum number of players must be between 1 and 100');
    }

    if (errMsgs.length >= 0) {
      this.setState({errMsgs: errMsgs});
    } else {
      // send request to server 
      
      //route to new game url
    }
  }

  onChange(evt, ltr) {
    console.log('evt in onChange is', evt);
    console.log('ltr in onChange is', ltr);
    evt.stopPropagation();
    let newState = {};
    newState[evt.target.id] = 'n';
    this.setState(newState);
  }

  render() {
    return (
      <Modal show={this.props.show} onClose={e => this.closeModal(e)}>
        <form onSubmit={e => this.onSubmit(e)} className={`${styles.gamemodal}`}>
          <div className='form-group'>
            <label htmlFor='roomName'>Room Name</label>
            <input type='text' className='form-control' id='roomName' aria-describedby='roomName' placeholder='Room Name' onChange={(evt, ltr) => this.onChange(evt, ltr)}/>
          </div>
          <div className='form-group'>
            <label htmlFor='roomName'>Set Max Players:</label>
            <input type='number' min='1' max='100' className={`${styles.roomnumber} form-control`} id='roomNum' aria-describedby='roomNumber' placeholder='50'/>
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
                <input type='password' className='form-control' id='roomPassword' placeholder='Password'/>
              </div>
              <div className='form-group disabled'>
                <label htmlFor='roomConfPassword'>Confirm Password</label>
                <input type='password' className='form-control' id='roomConfPassword' placeholder='Confirm Password'/>
              </div>
            </div>
          )}
          <div className={`${styles.footer}`}>
            <button type='submit' className={`${styles.width} btn btn-primary`}>
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
};
