import React from 'react';
import PropTypes from 'prop-types';

let NumberOfUsers = props => (
  <div className='text-center alert alert-info'>
    {
      props.numUsers > 1 ?
        'There are currently ' + props.numUsers + ' players playing.' :
        'You are currently the only player... Your chances of winning are pretty good ;)'
    }
  </div>
);

NumberOfUsers.propTypes = {
  numUsers: PropTypes.number.isRequired,
};

export default NumberOfUsers;
