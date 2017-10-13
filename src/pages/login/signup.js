import React from 'react';
import styles from './login.scss';
import PropTypes from 'prop-types';

const SignUp = props => (
  <form className={styles.forms} onSubmit={evt => props.handleSubmit(evt)}>
    <div className='form-group'>
      <p className='text-center'>{props.showCriteria ? 'Hide' : 'Show'} form criteria:</p>
      <button
        className={'btn btn-sm btn-primary center-block'}
        onClick={props.toggleCriteria}>
        {props.showCriteria ? 'Hide' : 'Show'}
      </button>
      <label htmlFor='email'>Email address</label>
      <input
        id='email'
        type='email'
        onChange={props.handleChange}
        value={props.vals.email}
        className='form-control'
        aria-describedby='email'
        placeholder='Enter email'
      />
      {props.showCriteria ? 
        (<small id='emailHelp' className='form-text text-muted'>
          We&#39;ll never share your email with anyone else.<br />
          You&#39;ll use this email to sign-in and recover passwords.
          <ul>
            <li>Must be a valid email.</li>
          </ul>
        </small>) :
        ''
      }
    </div>

    <div className='form-group'>
      <label htmlFor='username'>Username</label>
      <input
        id='username'
        type='text'
        onChange={props.handleChange}
        value={props.vals.username}
        className='form-control'
        placeholder='Enter desired username'
      />
      {props.showCriteria ? 
        (<small id='usernameHelp' className='form-text text-muted'>
          This will be your public handle ... choose wisely!
          <ul>
            <li>Between 4 and 15 characters.</li>
            <li>May only contain letters, numbers, or underscores.</li>
          </ul>
        </small>) : ''}
    </div>

    <div className='form-group'>
      <label htmlFor='password'>Password</label>
      <input
        id='password'
        type='password'
        onChange={props.handleChange}
        value={props.vals.password}
        className='form-control'
        placeholder='Password'
      />
      {props.showCriteria ? 
        (<small id='passwordHelp' className='form-text text-muted'>
          As always, make it strong!
          <ul>
            <li>Between 6 and 100 characters.</li>
            <li>At least one uppercase and lowercase letter.</li>
          </ul>
        </small>) : ''}
    </div>

    <div className='form-group'>
      <label htmlFor='confpassword'>Password</label>
      <input
        id='confpassword'
        type='password'
        onChange={props.handleChange}
        value={props.vals.confpassword}
        className='form-control'
        placeholder='Confirm Password'
      />
      {props.showCriteria ? 
        (<small id='confpasswordHelp' className='form-text text-muted'>
          Make it match.
        </small>) : ''}
    </div>
    
    <button
      className={`btn btn-lg btn-primary center-block ${styles.newbtn}`}
      type='submit'>
      Sign Up
    </button>
  </form>
);

SignUp.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  vals: PropTypes.object.isRequired,
  toggleCriteria: PropTypes.func.isRequired,
  showCriteria: PropTypes.bool.isRequired,
};

export default SignUp;
