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
  letter: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  val: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default BingoSquare;
