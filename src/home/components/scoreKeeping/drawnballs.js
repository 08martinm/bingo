import React from 'react';
import PropTypes from 'prop-types';
import styles from './scoreKeeping.scss';

let DrawnBalls = props => (
  <div className={`${styles.tracker} text-center`} style={{backgroundColor: props.bgColor}}>

    <div className={`${styles.trackertitle}`}>
      <h3>Numbers already drawn:</h3>
    </div>

    <div className={styles.trackertitle}>
      <div className={`${styles.bingorow} ${styles.trackertile}`}>
        {'BINGO'.split('').map((val, key) => (
          <div key={key} className={`${styles.trackersquare} ${styles['title-' + key]} ${styles.trackertitlesquare}`}>
            {val}
          </div>
        ))}
      </div>
    </div>

    <div className={`${styles.trackernumbers}`}>
      {Object.keys(props.drawn).map((keyName, key) => (
        <div key={key} className={`${styles.trackercolumn} ${styles.trackertile}`}>
          {props.drawn[keyName].map((num, key2) => <div key={key2} className={`${styles.trackersquare} ` + styles['square-' + keyName]}>{num}</div>)}
        </div>
      ))}
    </div>

  </div>
);

DrawnBalls.propTypes = {
  bgColor: PropTypes.string.isRequired,
  drawn: PropTypes.object.isRequired,
};

export default DrawnBalls;
