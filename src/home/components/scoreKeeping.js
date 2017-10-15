import React from 'react';
import PropTypes from 'prop-types';
import styles from './scoreKeeping.scss';

const ScoreKeeping = props => {
  let className = props.current ? styles['color-' + props.current[0]] : '';
  return (
    <div className={`${styles.scorecontainer} col-xs-4`}>
      <div className='text-center alert alert-info'>
        {
          props.numUsers > 1 ?
            'There are currently ' + props.numUsers + ' players playing.' :
            'You are currently the only player... Your chances of winning are pretty good ;)'
        }
      </div>
      <div className={`${styles.newnumber}`}>
        <h3 className='text-center'>The new ball is:</h3>
        <div className={`${styles.poolball} ${className}`}>
          <span className={styles.poolballnum}>{props.current ? props.current.toUpperCase() : ''}</span>
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
};

ScoreKeeping.propTypes = {
  numUsers: PropTypes.number.isRequired,
  current: PropTypes.string,
  drawn: PropTypes.object.isRequired,
  val: PropTypes.string.isRequired,
};

export default ScoreKeeping;