import React from 'react';
import PropTypes from 'prop-types';
import styles from './scoreKeeping.scss';

const ScoreKeeping = props => (
  <div className={`${styles.scorecontainer} col-xs-4`}>
    <div className={`${styles.newnumber}`}>
      <h3 className='text-center'>The new ball is:</h3>
      <div className={styles.poolball}>
        <span className={styles.poolballnum}>G10</span>
      </div>
    </div>
    <div className={`${styles.tracker} text-center`}>
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
  </div>
);

ScoreKeeping.propTypes = {
  drawn: PropTypes.object.isRequired,
  val: PropTypes.string.isRequired,
};

export default ScoreKeeping;