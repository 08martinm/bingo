import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Nav from './components/nav';
import GameModal from './components/gameModal';
import PasswordModal from './components/passwordModal';
import styles from './roomSelector.scss';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
const socket = io();

class RoomSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      nextRoom: 1,
      createGameModal: false,
      enterPasswordModal: false,
      roomName: '',
    };
    socket.on('game created', newRoom => this.routeToNewRoom(newRoom));
    this.updateRoomsAndUsers = this.updateRoomsAndUsers.bind(this);
    this.getNextRoom = this.getNextRoom.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.routeToNewRoom = this.routeToNewRoom.bind(this);
    this.routeToGame = this.routeToGame.bind(this);
    this.checkIfPrivate = this.checkIfPrivate.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
  }

  componentDidMount() {
    socket.on('update rooms and users', newState => this.updateRoomsAndUsers(newState));
    socket.emit('get rooms and users');
  }

  updateRoomsAndUsers(newState) {
    let newGames = [];
    Object.keys(newState).forEach(keyName => {
      newGames.push({
        room: keyName,
        numUsers: newState[keyName].numUsers,
        maxUsers: newState[keyName].maxUsers,
        private: newState[keyName].private,
      });
    });
    this.setState({games: newGames});
    this.getNextRoom();
  }

  getNextRoom()  {
    let rooms = {};
    this.state.games.forEach(game => rooms[game.room] = true);
    let i = 1;
    while (rooms.hasOwnProperty('Room #' + i)) {
      i++;
    }
    this.setState({nextRoom: i});
  }

  toggleModal(evt) {
    evt.stopPropagation();
    let id = evt.target.id;
    if (id == 'create-game') {
      this.setState({createGameModal: true});
    } else if (id == 'modal-backdrop' || id == 'modal-close') {
      this.setState({createGameModal: false, enterPasswordModal: false, roomName: ''});
    } else {
      this.setState({enterPasswordModal: true, roomName: id});
    }
  }

  createGame(obj) {
    socket.emit('create new room', obj);
  }

  routeToNewRoom(newRoom) {
    this.props.history.push('/room/' + newRoom);
  }

  routeToGame(newRoom) {
    this.props.history.push('/room/' + newRoom);
  }

  checkIfPrivate(evt) {
    let id = evt.currentTarget.id;
    let game = this.state.games.find(game => game.room === id);
    if (game.private) {
      this.setState({enterPasswordModal: true, roomName: game.room});
    } else {
      this.props.history.push('/room/' + game.room);
    }
  }

  checkPassword(obj) {
    axios.post('/game', {
      password: obj.password,
      room: obj.room,
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
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
            {this.state.games.map((game, key) => <GameContainer key={key} game={game} checkIfPrivate={this.checkIfPrivate}/>)}
            <div className={`list-group-item active ${styles.gamecontainer}`}>
              <div onClick={e => this.toggleModal(e)}>
                <div id='create-game' className={`${styles.create}`}>
                  Create new Game (Room #{this.state.nextRoom})
                </div>
              </div>
              <GameModal show={this.state.createGameModal} toggleModal={this.toggleModal} nextRoom={this.state.nextRoom} games={this.state.games} createGame={this.createGame}/>
              <PasswordModal show={this.state.enterPasswordModal} toggleModal={this.toggleModal} routeToGame={this.routeToGame} roomName={this.state.roomName} checkPassword={this.checkPassword} />
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
  console.log('props.game is', props.game);
  let className = props.game.private ? 'fa-lock' : 'fa-unlock';
  return (
    <div id={props.game.room} onClick={evt => props.checkIfPrivate(evt)} className={`list-group-item ${styles.gamecontainer}`}>
      <div className={`${styles.item1}`}>{props.game.room}</div>
      <div className={`${styles.item2}`}><i className={`fa ${className} ${styles.icon}`} aria-hidden='true' /></div>
      <div className={`${styles.item3}`}><i className={`fa fa-user-times ${styles.icon}`} aria-hidden='true' />{props.game.numUsers}</div>
      <div className={`${styles.item4}`}><i className={`fa fa-users ${styles.icon}`} aria-hidden='true' />{props.game.maxUsers}</div>
    </div>
  );
};

GameContainer.propTypes = {
  checkIfPrivate: PropTypes.func.isRequired,
  game: PropTypes.object.isRequired,
};
