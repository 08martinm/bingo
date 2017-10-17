import React from 'react';
import Nav from '../../home/components/nav';
import PropTypes from 'prop-types';

const Profile = props => (
  <div className='row'>
    <Nav handleAuth={props.handleAuth} />

    <div className='jumbotron'>
      <h1 className='display-3'>Hello, {props.handleAuth.username}!</h1>
      <p className='lead'>Thank you for playing BingoByMatthew.</p>
      <hr className='my-4' />
      <p>Here, you can take a look at your stats and adjust your profile information.</p>
    </div>
  </div>
);

Profile.propTypes = {
  handleAuth: PropTypes.object.isRequired,
};

export default Profile;
