import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Nav from './components/nav';
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
    };
    this.updateRoomsAndUsers = this.updateRoomsAndUsers.bind(this);
    this.getNextRoom = this.getNextRoom.bind(this);
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
              <Link to={'/room/' + this.state.nextRoom}><div className={`${styles.create}`}>Create new Game (Room #{this.state.nextRoom})</div></Link>
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
