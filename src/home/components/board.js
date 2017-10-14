import React from 'react';
import PropTypes from 'prop-types';
import styles from './board.scss';

let Board = props => (
  <div className={`${styles.boardconatiner} col-xs-8`}>

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
            {
              Object.keys(props.board[keyName])
                .sort((obj1, obj2) => props.board[keyName][obj1].order - props.board[keyName][obj2].order)
                .map((num, key) => <BingoSquare onClick={props.onClick} key={key} letter={keyName} val={+num} selected={props.board[keyName][num].clicked}/>)
            }
          </div>
        ))}
      </div>

    </div>

    
    <div className={`${styles.bingobutton}`} onClick={props.checkBingo}>
      BINGO!
      <i></i>
    </div>

  </div>
);

Board.propTypes = {
  board: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  checkBingo: PropTypes.func.isRequired,
};

export default Board;

let BingoSquare = props => {
  let className = props.selected ? styles.selected : '';
  return(
    <div onClick={props.onClick} className={`${styles.bingosquare} ${styles['square-' + props.letter]} ${className} ${styles.pointer}`}>
      {props.val}
    </div>
  );
};

BingoSquare.propTypes = {
  selected: PropTypes.bool.isRequired,
  letter: PropTypes.string.isRequired,
  val: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onClick: PropTypes.func.isRequired,
};
