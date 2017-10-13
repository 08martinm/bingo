import React from 'react';
import PropTypes from 'prop-types';
import Nav from './components/nav';
import Board from './components/board';
import ScoreKeeping from './components/scoreKeeping';

const Home = props => {
  let arrs = new Array(5);
  let currArr = 0;
  arrs[currArr] = [];
  for (let i = 1; i <= 100; i++) {
    arrs[currArr].push(i);
    if(i % 20 === 0) {
      currArr++;
      arrs[currArr] = [];
    }
  }

  return (
    <div className='row'>
      <Nav handleAuth={props.handleAuth}/>
      <ScoreKeeping val={'1'} drawn={{b: arrs[0], i: arrs[1], n: arrs[2], g: arrs[3], o: arrs[4]}} />
      <Board board={{b: [1, 2, 3, 4, 5], i: [6, 7, 8, 9, 10], n: [1,2,3,4,5], g: [1,2,3,4,5], o: [1,2,3,4,5]}}/>
    </div>
  );
};

Home.propTypes = {
  handleAuth: PropTypes.object.isRequired,
};

export default Home;
