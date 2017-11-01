import React from 'react';
import PropTypes from 'prop-types';
import styles from './board.scss';

let BingoSquare = props => (
  <div>
    {props.gameMaster ?
      <div className='text-center alert alert-info'>
        You are the <b>Game Master</b>!<br />
        Click on the Draw Ball button as you please... You control the tempo!<br />
        <br />
        <div className={`${styles.flexify} text-center`}>
          <button className='btn btn-success' onClick={props.drawLotteryBall}>Draw Ball</button> 
          <button className='btn btn-primary btn-sm' onClick={() => props.newBoard()}>New Board</button>
          <button className='btn btn-primary btn-sm' style={{backgroundColor: props.bgColor}} onClick={props.changeTheme}>Change Theme</button>
          <button className='btn btn-danger btn-sm' onClick={props.resetBoard}>New game</button>
        </div>
      </div> :
      <div className='text-center alert alert-info'>
        You are a <b>Participant</b>!<br />
        Check those boxes quickly and call Bingo as soon as you can!<br />
        <br />
        <div className={`${styles.flexify} text-center`}>
          <button className='center-block btn btn-primary btn-sm' onClick={() => props.newBoard()}>New Board</button>
          <button className='center-block btn btn-primary btn-sm' style={{backgroundColor: props.bgColor}} onClick={props.changeTheme}>Change Theme</button>
        </div>
      </div>
    }
  </div>
);

BingoSquare.propTypes = {
  bgColor: PropTypes.string,
  changeTheme: PropTypes.func.isRequired,
  drawLotteryBall: PropTypes.func.isRequired,
  gameMaster: PropTypes.bool.isRequired,
  newBoard: PropTypes.func.isRequired,
  resetBoard: PropTypes.func.isRequired,
};

export default BingoSquare;
