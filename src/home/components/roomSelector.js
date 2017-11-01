import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Nav from './nav';
import Jumbotron from './roomSelector/jumbotron';
import GameList from './roomSelector/gamelist';
import styles from './roomSelector/roomSelector.scss';
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
        <Jumbotron />
        <GameList 
          checkIfPrivate={this.checkIfPrivate}
          checkPassword={this.checkPassword}
          createGame={this.createGame}
          createGameModal={this.state.createGameModal}
          enterPasswordModal={this.state.enterPasswordModal}
          games={this.state.games}
          nextRoom={this.state.nextRoom}
          roomName={this.state.roomName}
          routeToGame={this.routeToGame}
          toggleModal={this.toggleModal}
        />
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
