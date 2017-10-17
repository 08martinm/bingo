import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Nav from './components/nav';
import axios from 'axios';
import styles from './roomSelector.scss';
import { Link } from 'react-router-dom';

class RoomSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [
        {room: 1, number: 6},
        {room: 2, number: 4},
      ]};
  }

  componentDidMount() {
    axios.get('/games')
      .then(games => this.setState({games: games}))
      .catch(err => console.log(err));
  }

  createNewRoom()  {
    axios.post('/games');
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
              <Link to={'/room/' + (this.state.games.length + 1)}><div className={`${styles.create}`}>Create new Game!</div></Link>
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
    <Link to={'/room/' + props.game.number}>
      <div className={`list-group-item ${styles.gamecontainer}`}>
        <div className={`${styles.item1}`}>Room #{props.game.room}</div>
        <div className={`${styles.item2}`}><i className={`fa fa-users ${styles.icon}`} aria-hidden='true' />{props.game.number}</div>
      </div>
    </Link>
  );
};

GameContainer.propTypes = {
  game: PropTypes.object.isRequired,
};
