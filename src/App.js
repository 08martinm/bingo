import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import Proptypes from 'prop-types';
import RoomSelector from './home/roomSelector';
import Home from './home';
import Verify from './pages/login/verify';
import Login from './pages/login';
import Reset from './pages/login/reset';
import Profile from './pages/profile';
import styles from './App.css';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {loggedin: false, username: null, email: null};
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login(username, email) {this.setState({loggedin: true, username: username, email: email});}
  logout() {
    axios.get('/api/logout')
      .then(response => {
        console.log(response);
        this.setState({loggedin: false, username: null, email: null});
      });
  }

  // Initializes whether user is loggedin
  componentDidMount() {
    let self = this;
    axios.get('/api/loggedin')
      .then(response => self.setState({loggedin: true, username: response.data.username, email: response.data.email}))
      .catch(() => self.setState({loggedin: false, username: null, email: null}));
  }

  render() {
    let handleAuth = {
      login: this.login,
      logout: this.logout,
      email: this.state.email,
      username: this.state.username,
      loggedin: this.state.loggedin,
    };
    return (
      <Router>
        <div className={`container-fluid ${styles.base}`}>
          <Switch>
            <RouteWithAuth exact path='/' component={RoomSelector} handleAuth={handleAuth}/>
            <RouteWithAuth path="/verify" component={Verify} handleAuth={handleAuth}/>
            <RouteWithAuth path='/login' component={Login} handleAuth={handleAuth}/>
            <RouteWithAuth path='/room' component={Home} handleAuth={handleAuth}/>
            <Route path='/reset' component={Reset}/>
            <PrivateRoute path='/profile' component={Profile} handleAuth={handleAuth} auth={this.state.loggedin}/>
            <Redirect to='/' />
          </Switch>
        </div>
      </Router>
    );
  }
}

const PrivateRoute = ({ component: Component, handleAuth: handleAuth, auth: Auth, ...rest }) => (
  <Route {...rest} render={props => (
    Auth ? (
      <Component handleAuth={handleAuth} {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location },
      }}/>
    )
  )}/>
);

PrivateRoute.propTypes = {
  component: Proptypes.oneOfType([Proptypes.object, Proptypes.func]).isRequired,
  location: Proptypes.object,
  auth: Proptypes.bool.isRequired,
  handleAuth: Proptypes.object.isRequired,
};

const RouteWithAuth = ({component: Component, handleAuth: handleAuth, ...rest}) => (
  <Route {...rest} render={props => {
    return <Component handleAuth={handleAuth} {...props}/>;}
  } />
);

RouteWithAuth.propTypes = {
  component: Proptypes.oneOfType([Proptypes.object, Proptypes.func]).isRequired,
  handleAuth: Proptypes.object.isRequired,
};

export default App;
