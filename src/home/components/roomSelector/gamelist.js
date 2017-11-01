import React from 'react';
import styles from './roomSelector.scss';
import PropTypes from 'prop-types';
import GameContainer from './gamecontainer';
import GameModal from './gameModal';
import PasswordModal from './passwordModal';

let GameList = props => (
  <div className={`${styles.gamelist} text-center`}>
    <h3 className={styles.title}>Games available</h3>
    <div className='list-group'>
      {props.games.map((game, key) => (
        <GameContainer key={key} game={game} checkIfPrivate={props.checkIfPrivate}/>
      ))}

      <div className={`list-group-item active ${styles.gamecontainer}`}>
        <div onClick={e => props.toggleModal(e)}>
          <div id='create-game' className={`${styles.create}`}>
            Create new Game (Room #{props.nextRoom})
          </div>
        </div>

        <GameModal
          createGame={props.createGame}
          games={props.games}
          nextRoom={props.nextRoom}
          show={props.createGameModal}
          toggleModal={props.toggleModal}
        />
        
        <PasswordModal
          show={props.enterPasswordModal}
          checkPassword={props.checkPassword}
          roomName={props.roomName}
          routeToGame={props.routeToGame}
          toggleModal={props.toggleModal}
        />
      </div>
    </div>
  </div>
);

GameList.propTypes = {
  checkIfPrivate: PropTypes.func.isRequired,
  checkPassword: PropTypes.func.isRequired,
  createGame: PropTypes.func.isRequired,
  createGameModal: PropTypes.bool.isRequired,
  enterPasswordModal: PropTypes.bool.isRequired,
  games: PropTypes.array,
  nextRoom: PropTypes.number,
  roomName: PropTypes.string,
  routeToGame: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default GameList;
