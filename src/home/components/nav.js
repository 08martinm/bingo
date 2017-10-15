import React from 'react';
import PropTypes from 'prop-types';
import styles from './nav.scss';
import { Link } from 'react-router-dom';

const Nav = props => {
  let url = window.location.href.split('/');
  return (
    <div>
      <div className={`${styles.container}`}>
        <div className={`${styles.home} ${styles.nav}`}>
          {url[url.length - 1] != '' ?
            <Link to='/'><span className={styles.route}>Home</span></Link> :
            <span>Home</span>
          }
        </div>
        <div className={`${styles.login} ${styles.nav}`}>
          {props.handleAuth.loggedin ?
            <Link to='login'><span className={styles.route}>Sign Out</span></Link> :
            url[url.length - 1] == 'login' ? 
              <span>Login</span> :
              <Link to='login'><span className={styles.route}>Login</span></Link>
          }
        </div>
        <div className={styles['text-container']}>
          <h2 className={styles.title}>Bingo!</h2>
        </div>
      </div>
    </div>
  );
};

Nav.propTypes = {
  handleAuth: PropTypes.object.isRequired,
};

const NavItem = (props) => {
  return (
    <li className={styles.li}>
      <a href={'#' + props.value} className={styles.a}>{props.value}</a>
    </li>
  );
};

NavItem.propTypes = {
  value: PropTypes.string.isRequired,
};

export default Nav;
