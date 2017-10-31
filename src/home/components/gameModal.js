import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Modal from './modal';
import styles from './gameModal.scss';

class GameModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      private: false,
      roomName: '',
      roomNum: 15,
      roomPassword: '',
      roomConfPassword: '',
      errMsgs: [],
    };
    this.togglePrivate = this.togglePrivate.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  togglePrivate() {
    this.setState({private: !this.state.private});
  }

  closeModal(evt) {
    evt.stopPropagation();
    let id = evt.target.id;
    if (id == 'modal-backdrop' || id == 'modal-close' || id == 'create-game') {
      this.setState({private: false, errMsgs: [], roomName: '', roomNum: 50, roomPassword: '', roomConfPassword: ''});
      this.props.toggleModal(evt);
    }
  }

  onSubmit(evt) {
    evt.preventDefault();
    let errMsgs = [];
    if (this.state.private && (this.state.roomConfPassword != this.state.roomPassword)) {
      errMsgs.push('Password and Confirm Password must match');
    }

    if (this.state.private && (this.state.roomPassword.length < 4 || this.state.roomPassword.length >= 25)) {
      errMsgs.push('Password must be between 5 and 25 characters');
    }

    let myRe = /^[a-z0-9_]+$/i;
    if (!myRe.exec(this.state.roomName)) {
      errMsgs.push('Room name may only contain alphanumeric characters and underscores');
    }

    if (this.props.games.reduce((curr, obj) => curr || (obj.room === this.state.roomName), false)) {
      errMsgs.push('Hmmm... it appears that room name has already been taken!');
    }

    if (this.state.roomName.length <= 4 || this.state.roomName.length >= 25) {
      errMsgs.push('Room name must be between 4 and 25 characters');
    }

    if (this.state.roomNum <= 0 || this.state.roomNum > 100) {
      errMsgs.push('The maximum number of players must be between 1 and 100');
    }

    if (errMsgs.length > 0) {
      this.setState({errMsgs: errMsgs});
    } else {
      this.setState({errMsgs: []});
      let newGame = {};
      newGame.maxUsers = +this.state.roomNum;
      newGame.room = this.state.roomName;
      newGame.private = this.state.private;
      if (this.state.private) {
        newGame.roomPassword = this.state.roomPassword;
      }

      this.props.createGame(newGame);
    }
  }

  onChange(evt) {
    evt.stopPropagation();
    let newState = {};
    newState[evt.target.id] = evt.target.value;
    this.setState(newState);
  }

  render() {
    return (
      <Modal show={this.props.show} onClose={e => this.closeModal(e)}>
        <form onSubmit={e => this.onSubmit(e)} className={`${styles.gamemodal}`}>
          <div className='form-group'>
            <label htmlFor='roomName'>Room Name</label>
            <input type='text' className='form-control' id='roomName' aria-describedby='roomName' placeholder='Room Name' onChange={evt => this.onChange(evt)}/>
          </div>
          <div className='form-group'>
            <label htmlFor='roomName'>Set Max Players:</label>
            <input type='number' min='1' max='100' className={`form-control ${styles.specific} ${styles.roomnumber}`} id='roomNum' aria-describedby='roomNumber' defaultValue='15' onChange={evt => this.onChange(evt)}/>
          </div>
          <div className='form-check'>
            <label className='form-check-label'>
              <input type='checkbox' className={`${styles.checkbox} form-check-input`} onClick={() => this.togglePrivate()}/>
              <div className={`${styles.checkboxtext}`}>Make game private? (requires password to join)</div>
            </label>
          </div>
          {this.state.private && (
            <div>
              <div className='form-group'>
                <label htmlFor='roomPassword'>Password</label>
                <input type='password' className='form-control' id='roomPassword' placeholder='Password' onChange={evt => this.onChange(evt)}/>
              </div>
              <div className='form-group disabled'>
                <label htmlFor='roomConfPassword'>Confirm Password</label>
                <input type='password' className='form-control' id='roomConfPassword' placeholder='Confirm Password' onChange={evt => this.onChange(evt)}/>
              </div>
            </div>
          )}
          <div className={`${styles.footer}`}>
            <button type='submit' className={`${styles.width} btn btn-primary`} onClick={this.onSubmit}>
              Create Game!
            </button>
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
  show: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  nextRoom: PropTypes.number.isRequired,
  games: PropTypes.array.isRequired,
  createGame: PropTypes.func.isRequired,
};
