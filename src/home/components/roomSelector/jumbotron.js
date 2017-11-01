import React from 'react';
import styles from './roomSelector.scss';

let Jumbotron = () => (
  <div className={`jumbotron text-center ${styles.pic}`}>
    <div className={`${styles.jumbotrontext}`}>
      <h1 className='display-3'>Hello, friend!</h1>
      <div className={`${styles.line}`} />
      <p className='lead'>
        Welcome to BingoByMatthew.<br/>
        Start by clicking on a game below,<br/>
        or creating a new one.
      </p>
    </div>
  </div>
);

export default Jumbotron;
