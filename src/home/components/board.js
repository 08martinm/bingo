import React from 'react';
import PropTypes from 'prop-types';
import styles from './board.scss';

let Board = props => (
  <div className={`${styles.boardconatiner} col-xs-8`}>
    <div className={`${styles.board}`}>
      <div className={styles.titlerow}>
        <div className={`${styles.bingorow} ${styles.bingotile}`}>
          {'BINGO'.split('').map((val, key) => (
            <div key={key} className={`${styles.bingosquare} ${styles['title-' + key]} ${styles.bingotitle}`}>
              {val}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.bingonumbers}>
        {Object.keys(props.board).map((keyName, key) => (
          <div key={key} className={`${styles.bingocolumn}  ${styles.bingotile}`}>
            {props.board[keyName].map((num, key) => <BingoSquare key={key} letter={keyName} val={num}/>)}
          </div>
        ))}
      </div>
    </div>
    <div className={`${styles.bingobutton}`}>BINGO!<i></i></div>
  </div>
);

Board.propTypes = {
  board: PropTypes.object.isRequired,
};

export default Board;

let BingoSquare = props => {
  return(
    <div className={`${styles.bingosquare} ${styles['square-' + props.letter]}`}>
      {props.val}
    </div>
  );
};

BingoSquare.propTypes = {
  letter: PropTypes.string.isRequired,
  val: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};
