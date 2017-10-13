import React, {Component} from 'react';
import styles from './login.scss';
import PropTypes from 'prop-types';
import axios from 'axios';
import Nav from '../../home/components/nav';

class Verification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      error: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(evt) {
    evt.preventDefault();
    this.setState({success: false, error: false});
    console.log('/api/verify' + this.props.location.search);
    axios.get('/api/verify' + this.props.location.search)
      .then(() => {
        this.setState({success: 'Your email is now verified! You will receive occasional emails notifying you of substantive updates to this website.', error: false});
      })
      .catch(() => {
        this.setState({error: 'There was an error verifying your email. Please try clicking on the link from your email again.', success: false});
      });
  }

  render() {
    return (
      <div className={`row ${styles.background}`}>
        <Nav handleAuth={this.props.handleAuth} />
        <div className={`${styles.container} text-center col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4`}>
          <div className='col-xs-12'>   
            <form className={styles.forms} onSubmit={evt => this.handleSubmit(evt)}>
              <h1>Hi there!</h1>
              <br/>
              <br/>
              Please click on the button below to verify your email account.<br/>
              <br/>
              This will complete your signup for BingoByMatthew!
              <button
                className={`btn btn-lg btn-primary center-block ${styles.newbtn}`}
                type='submit'>
                Verify Email
              </button>
            </form>
            {this.state.success ? <div className='alert alert-success'>{this.state.success}</div> : ''}
            {this.state.error ? <div className='alert alert-danger'>{this.state.error}</div> : ''}
          </div>
        </div>
      </div>
    );
  }
}

Verification.propTypes = {
  handleAuth: PropTypes.object.isRequired,
  location: PropTypes.object,
};

export default Verification;
