import React from 'react';
import PropTypes from 'prop-types';
import styles from './board.scss';

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

export default BingoSquare;
