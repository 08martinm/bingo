import React from 'react';
import PropTypes from 'prop-types';
import styles from './board.scss';

let Board = props => (
  <div className={`${styles.boardconatiner} col-xs-8`}>

    {props.invalidAttempt && <div className='text-center alert alert-danger'>Psh, thats not a BINGO. Try again!</div>}

    {
      props.won == null ?
        '' :
        props.won ?
          <div className='text-center alert alert-success'>You WONN!!!!!! NO WAY!! WOOOO!!!!</div> :
          <div className='text-center alert alert-danger'>OH NOOOoooOOOoo!! You LOST!</div>
    }

    { props.won != null && <div className='text-center alert alert-info'>Please wait for the Game Master to start a new game. You can select a new board in the meantime if you wish.</div>}

    {
      props.gameMaster ?
        (
          <div className='text-center alert alert-info'>
            You are the <b>Game Master</b>!<br />
            Click on the Draw Ball button as you please... You control the tempo!<br />
            <br />
            <div className={`${styles.flexify} text-center`}>
              <button className='btn btn-success' onClick={props.drawLotteryBall}>Draw Ball</button> 
              <button className='btn btn-primary btn-sm' onClick={props.newBoard}>New Board</button>
              <button className='btn btn-danger btn-sm' onClick={props.resetBoard}>New game</button>
            </div>
          </div>
        ):
        <button className={`${styles.btnspacing} center-block btn btn-primary btn-sm`} onClick={props.newBoard}>New Board</button>
    }


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
  invalidAttempt: PropTypes.bool.isRequired,
  drawLotteryBall: PropTypes.func.isRequired,
  handleAuth: PropTypes.object.isRequired,
  newBoard: PropTypes.func.isRequired,
  won: PropTypes.bool,
  gameMaster: PropTypes.bool.isRequired,
  board: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  checkBingo: PropTypes.func.isRequired,
  resetBoard: PropTypes.func.isRequired,
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
