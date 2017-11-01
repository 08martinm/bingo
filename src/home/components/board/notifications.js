import React from 'react';
import PropTypes from 'prop-types';

let Notifications = props => (
  <div>
    {props.invalidAttempt && 
      <div className='text-center alert alert-danger'>
        Psh, thats not a BINGO. Try again!
      </div>
    }

    {props.won && 
      <div className='text-center alert alert-success'>
        You WONN!!!!!! NO WAY!! WOOOO!!!!
      </div>
    }

    {props.won === false && 
      <div className='text-center alert alert-danger'>
        OH NOOOoooOOOoo!! You LOST!
      </div>
    }

    {props.won != null && 
      <div className='text-center alert alert-info'>
        Please wait for the Game Master to start a new game.
        You can select a new board in the meantime if you wish.
      </div>
    }
  </div>
);

Notifications.propTypes = {
  invalidAttempt: PropTypes.bool,
  won: PropTypes.bool,
};

export default Notifications;
