import React, {Component} from 'react';
import styles from './login.scss';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resetpassword: '',
      resetconfpassword: '',
      showErr: false,
      showSuccess: false,
      showSpinner: false,
      errMsg: '',
    };
    this.reset = this.reset.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  reset(event) {
    event.preventDefault();
    this.setState({showSpinner: true, showSuccess: false, showErr: false});
    let body = {
      password: this.state.resetpassword,
      confpassword: this.state.resetconfpassword,
    };
    axios.post('/api/reset/' + this.props.location.pathname.split('/')[2], body)
      .then(() => this.setState({showSuccess: true, showErr: false, showSpinner: false, errMsg: ''}))
      .catch(err => {
        let error = JSON.parse(JSON.stringify(err));
        this.setState({showSuccess: false, showErr: true, showSpinner: false, errMsg: error.response.data});
      });
  }

  handleChange(evt) {
    let newState = {};
    newState[evt.target.id] = evt.target.value;
    this.setState(newState);
  }

  render() {
    return (
      <div className={`row ${styles.background}`}>
        <div className={`${styles.container} col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4`}>
          <div className='col-xs-12'>
            <ResetPw handleSubmit={this.reset} handleChange={this.handleChange} vals={this.state}/>
            {this.state.showErr ? (
              typeof this.state.errMsg === 'string' ?
                (<div className='text-center alert alert-danger'>
                  {this.state.errMsg}
                </div>) :
                (
                  this.state.errMsg.map((val, i) => (
                    <div key={i} className='text-center alert alert-danger'>
                      {val}
                    </div>
                  ))
                )
            ) : ''}
            {this.state.showSuccess ? <SuccessMsg /> : ''}
            {this.state.showSpinner ? <Spinner /> : ''}
          </div>
        </div>
      </div>
    );
  }
}

Reset.propTypes = {
  router: PropTypes.object,
  location: PropTypes.object,
};

export default Reset;

const ResetPw = props => (
  <form className={`text-center ${styles.forms}`} onSubmit={props.handleSubmit}>
    <div className='form-group'>
      <label htmlFor='resetpassword'>Password</label>
      <input id='resetpassword' onChange={props.handleChange} value={props.vals.password} type='password' className='form-control' placeholder='Password' />
    </div>
    <div className='form-group'>
      <label htmlFor='resetpassword center-block'>Confirm Password</label>
      <input id='resetconfpassword' onChange={props.handleChange} value={props.vals.confpassword} type='password' className='form-control' placeholder='Password (must match)' />
    </div>
    <button className={`btn btn-lg btn-primary center-block ${styles.newbtn}`} type='submit'>Submit</button>
  </form>
);

ResetPw.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  vals: PropTypes.object.isRequired,
};

// const ErrMsg = () => (
//   <div className='text-center alert alert-danger'>
//     You must use the link sent to your email address to reset your password.<br />
//     If still not working, try getting a new link from <Link className='alert-link' to='/login' >Forgot Password</Link>.
//   </div>
// );

const SuccessMsg = () => (
  <div className='text-center alert alert-success'>
    Password successfully reset! Please sign in from the <Link className='alert-link' to='/login' >login page</Link>.
  </div>
);

const Spinner = () => (
  <i className='fa fa-spinner fa-spin'></i>
);
