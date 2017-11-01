import React from 'react';
import styles from './roomSelector.scss';
import PropTypes from 'prop-types';

let GameContainer = props => {
  console.log('props.game is', props.game);
  let className = props.game.private ? 'fa-lock' : 'fa-unlock';
  return (
    <div
      className={`list-group-item ${styles.gamecontainer}`}
      id={props.game.room}
      onClick={evt => props.checkIfPrivate(evt)}
    >
      <div className={`${styles.item1}`}>
        {props.game.room}
      </div>

      <div className={`${styles.item2}`}>
        <i className={`fa ${className} ${styles.icon}`} aria-hidden='true' />
      </div>

      <div className={`${styles.item3}`}>
        <i className={`fa fa-user-times ${styles.icon}`} aria-hidden='true' />
        {props.game.numUsers}
      </div>

      <div className={`${styles.item4}`}>
        <i className={`fa fa-users ${styles.icon}`} aria-hidden='true' />
        {props.game.maxUsers}
      </div>
    </div>
  );
};

GameContainer.propTypes = {
  checkIfPrivate: PropTypes.func.isRequired,
  game: PropTypes.object.isRequired,
};

export default GameContainer;
