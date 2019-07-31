import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
// import PropTypes from 'prop-types';

import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Profile from "./components/profile/profile";
import ProfileEditor from "./components/profile/profileEditor";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import MentorList from "./components/mentorlist/MentorList";
import Example from "./components/example";

class App extends Component {
  componentWillMount() {
    // Check for token to keep user logged in
    if (localStorage.jwtToken) {
      // Set auth token header auth
      const token = localStorage.jwtToken;
      setAuthToken(token);
      // Decode token and get user info and exp
      const decoded = jwt_decode(token);
      store.dispatch(setCurrentUser(decoded));
      
      // Check for expired token
      const currentTime = Date.now() / 1000; // to get in milliseconds
    
      if (decoded.exp < currentTime) {
        // Logout user
        store.dispatch(logoutUser());    // Redirect to login
        window.location.href = "/";
      }
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar 
              currentUser={this.props.user} 
            />
            <Route exact path="/" component={Login} />
            <Route exact path="/register" component={Register} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
							<PrivateRoute exact path="/mentors" component={MentorList} />
              <PrivateRoute exact path="/profile" component={Profile} />
              <PrivateRoute exact path="/profileEditor" component={ProfileEditor} />
              <PrivateRoute exact path="/example" component={Example} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

// App.propTypes = {
//   isAuth: PropTypes.bool.isRequired,
//   decoded: PropTypes.object.isRequired,
//   user: PropTypes.object.isRequired
// }

// const mapStateToProps = state => {
//   return {
//     isAuth: state.auth.isAuthenticated,
//     decoded: state.auth.decoded,
//     user: state.auth.user
//   }
// };

export default App;
