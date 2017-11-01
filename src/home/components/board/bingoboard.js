import React from 'react';
import PropTypes from 'prop-types';
import styles from './board.scss';
import BingoSquare from './bingosquare';

let BingoBoard = props => (
  <div className={`${styles.board}`}>
    <div className={styles.titlerow}>
      <div className={`${styles.bingorow} ${styles.bingotile}`}>
        {'bingo'.split('').map((val, key) => (
          <div key={key} className={`${styles.bingosquare} ${styles['title-' + key]} ${styles.bingotitle}`}>{val.toUpperCase()}</div>
        ))}
      </div>
    </div>

    <div className={styles.bingonumbers}>
      {'bingo'.split('').map((keyName, key) => (
        <div key={key} className={`${styles.bingocolumn}  ${styles.bingotile}`}>
          {Object.keys(props.board[keyName])
            .sort((obj1, obj2) => props.board[keyName][obj1].order - props.board[keyName][obj2].order)
            .map((num, key) => <BingoSquare onClick={props.onClick} key={key} letter={keyName} val={+num} selected={props.board[keyName][num].clicked}/>)
          }
        </div>
      ))}
    </div>
  </div>
);

BingoBoard.propTypes = {
  board: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default BingoBoard;
