import React from 'react';
import PropTypes from 'prop-types';
import styles from './modal.scss';

class Modal extends React.Component {
  render() {
    // Render nothing if the "show" prop is false
    if(!this.props.show) return null;

    return (
      <div className={`${styles.backdrop}`} id='modal-backdrop' onClick={this.props.onClose}>
        <div className={`${styles.modal}`}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node,
};

export default Modal;
