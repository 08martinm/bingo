import React from 'react';
import PropTypes from 'prop-types';
import styles from './login.scss';

const Logout = props => (
  <div className={`block-center text-center ${styles.logout}`}>
    <p>
      You are logged in as <b>{props.handleAuth.username}</b>.<br />
      Sign out if you would like to change accounts.
    </p>
    <button
      className={`btn btn-lg btn-primary center-block ${styles.newbtn}`}
      onClick={props.logout}>
      Sign Out
    </button>
  </div>
);

Logout.propTypes = {
  handleAuth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
};

export default Logout;
