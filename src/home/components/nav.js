import React from 'react';
import PropTypes from 'prop-types';
import styles from './nav.scss';
import { Link } from 'react-router-dom';

const Nav = props => {
  let url = window.location.href.split('/');
  let colors;
  let textcolor;
  if (props.bgColor) {
    colors = props.bgColor.slice(4, props.bgColor.length - 1).split(',');
    textcolor = (colors.reduce((a,b) => +a + +b, 0) < (127.5 * 3)) ? styles.white : styles.dark;
  } else {
    colors = [0, 31, 63];
    textcolor = [255, 255, 250];
  }

  return (
    <div>
      <div style={{backgroundColor: props.bgColor}} className={`${styles.container}`}>
        <div className={`${styles.home} ${styles.nav}`}>
          {url[url.length - 1] != '' ?
            <Link to='/'><span className={`${styles.route} ${textcolor}`}>Home</span></Link> :
            <span className={`${textcolor}`}>Home</span>
          }
        </div>
        <div className={`${styles.login} ${styles.nav}`}>
          {props.handleAuth.loggedin ?
            <Link to='profile'><span className={`${styles.route} ${textcolor}`}>Profile</span></Link> :
            url[url.length - 1] == 'login' ? 
              <span className={`${textcolor}`}>Login</span> :
              <Link to='/login'><span className={`${styles.route} ${textcolor}`}>Login</span></Link>
          }
        </div>
        <div className={styles['text-container']}>
          <h2 className={`${styles.title} ${textcolor}`}>Bingo!</h2>
        </div>
      </div>
    </div>
  );
};

Nav.propTypes = {
  handleAuth: PropTypes.object.isRequired,
  bgColor: PropTypes.string,
  changeTheme: PropTypes.func,
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
