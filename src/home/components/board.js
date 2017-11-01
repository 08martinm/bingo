import React from 'react';
import PropTypes from 'prop-types';
import styles from './board/board.scss';
import Notifications from './board/notifications';
import Controls from './board/controls';
import BingoBoard from './board/bingoboard';
import BingoButton from './board/bingobutton';

let Board = props => (
  <div className={`${styles.boardconatiner} col-xs-8`}>
    <Notifications won={props.won} invalidAttempt={props.invalidAttempt} />
    <Controls {...props} />
    <BingoBoard board={props.board} onClick={props.onClick} />
    <BingoButton checkBingo={props.checkBingo} />
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
  changeTheme: PropTypes.func.isRequired,
  bgColor: PropTypes.string.isRequired,
};

export default Board;
