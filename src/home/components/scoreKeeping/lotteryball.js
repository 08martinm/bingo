import React from 'react';
import styles from './scoreKeeping.scss';
import PropTypes from 'prop-types';

let LotteryBall = props => (
  <div className={`${styles.newnumber}`} style={{backgroundColor: props.bgColor}}>
    <h3 className='text-center'>The new ball is:</h3>
    <div className={`${styles.poolball} ${styles[props.className]}`}>
      <span className={styles.poolballnum}>{props.current ? props.current.toUpperCase() : ''}</span>
    </div>
  </div>
);

LotteryBall.propTypes = {
  bgColor: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  current: PropTypes.string,
};

export default LotteryBall;
