import React from 'react';
import PropTypes from 'prop-types';
import styles from './board.scss';

let BingoButton = props => (
  <div className={`${styles.bingobutton}`} onClick={props.checkBingo}>
    BINGO!
    <i></i>
  </div>
);

BingoButton.propTypes = {
  checkBingo: PropTypes.func.isRequired,
};

export default BingoButton;



