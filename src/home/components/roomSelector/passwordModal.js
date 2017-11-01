import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Modal from '../modal';
import styles from './gameModal.scss';
import axios from 'axios';

class GameModal extends Component {
  constructor(props) {
    super(props);
    this.state = {roomPassword: '', errMsgs: []};
    this.closeModal = this.closeModal.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  closeModal(evt) {
    evt.stopPropagation();
    let id = evt.target.id;
    if (id == 'modal-backdrop' || id == 'modal-close' || id == 'create-game') {
      console.log('evt fired in closeModal');
      this.setState({roomPassword: ''});
      this.props.toggleModal(evt);
    }
  }

  onSubmit(evt) {
    evt.preventDefault();
    let self = this;
    this.setState({showSpinner: true});
    axios.post('/game', {
      password: this.state.roomPassword,
      room: this.props.roomName,
    })
      .then(function (bool) {
        console.log(bool);
        self.setState({showSpinner: false});
        if (bool) {
          self.props.routeToGame(self.props.roomName);
        } else {
          self.setState({errMsgs: ['Oops! That is not the password...']});
        }
      })
      .catch(function (error) {
        console.log(error);
        self.setState({errMsgs: ['Oops! That is not the password...']});
      });
  }

  onChange(evt) {
    evt.stopPropagation();
    this.setState({roomPassword: evt.target.value});
  }

  render() {
    return (
      <Modal show={this.props.show} onClose={e => this.closeModal(e)}>
        <form onSubmit={e => this.onSubmit(e)} className={`${styles.gamemodal}`}>
          <div>
            <div className='form-group'>
              <label htmlFor='roomPassword'>Password</label>
              <input type='password' className='form-control' id='roomPassword' placeholder='Password' onChange={evt => this.onChange(evt)}/>
            </div>
          </div>
          <div className={`${styles.footer}`}>
            <button type='submit' className={`${styles.width} btn btn-primary`} onClick={this.onSubmit}>Proceed</button>
            <button id='modal-close' className={`${styles.width} btn btn-danger`}>Cancel</button>
          </div>
          {this.state.errMsgs.length > 0 &&
            <div>
              {this.state.errMsgs.map((val, key) => (
                <div key={key} className='alert alert-danger'>
                  {val}
                </div>
              ))}
            </div>
          }
        </form>
      </Modal>
    );
  }
}

export default GameModal;

GameModal.propTypes = {
  checkPassword: PropTypes.func.isRequired,
  roomName: PropTypes.string.isRequired,
  routeToGame: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};
