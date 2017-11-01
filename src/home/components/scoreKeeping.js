import React from 'react';
import PropTypes from 'prop-types';
import styles from './scoreKeeping/scoreKeeping.scss';
import NumberOfUsers from './scoreKeeping/numberOfUsers';
import LotteryBall from './scoreKeeping/lotteryball';
import DrawnBalls from './scoreKeeping/drawnballs';

const ScoreKeeping = props => {
  let className = props.current ? 'color-' + props.current[0] : '';
  return (
    <div className={`${styles.scorecontainer} col-xs-4`}>
      <NumberOfUsers numUsers={props.numUsers}/>
      <LotteryBall bgColor={props.bgColor} className={className} current={props.current}/>
      <DrawnBalls bgColor={props.bgColor} drawn={props.drawn} />
    </div>
  );
};

ScoreKeeping.propTypes = {
  bgColor: PropTypes.string.isRequired,
  current: PropTypes.string,
  drawn: PropTypes.object.isRequired,
  numUsers: PropTypes.number.isRequired,
  val: PropTypes.string.isRequired,
};

export default ScoreKeeping;