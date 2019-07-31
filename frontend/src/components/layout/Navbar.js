import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import { logoutUser } from "../../actions/authActions";

import './Navbar.css';

class Navbar extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    logoutUser: PropTypes.func.isRequired
  };

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const auth = this.props.auth.isAuthenticated;
    const user = this.props.auth.user;
	const profileURL = "profile?" + user.id;


    const LoggedOutView = props => {
        if (!auth) {
          return (
            <ul className="nav justify-content-end align-items-center">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="login" className="nav-link">
                  Sign in
                </Link>
              </li>
              <li className="nav-item">
                <Link to="register" className="nav-link">
                  Sign up
                </Link>
              </li>
            </ul>
          );
        }
        return null;
      };
      
      const LoggedInView = props => {
        if (auth) {
          return (
            <ul className="nav justify-content-end align-items-center">
              <li className="nav-item">
                <Link to="" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="example" className="nav-link">
                  <i className="ion-compose"></i>&nbsp;New Post
                </Link>
              </li>
              <li className="nav-item">
                <Link to={profileURL} className="nav-link">
                  <i className="ion-gear-a"></i>&nbsp;Profile
                </Link>
              </li>
              <li className="nav-item">
                <button
                  style={{textDecoration: 'none'}}
                  onClick={this.onLogoutClick}
                  className="btn btn-link"
                >
                  Logout
                </button>
              </li>
            </ul>
          );
        }
        return null;
      };

      return (
          <nav className="navbar navbar-light">
            <div className="container">
              <Link to="/" className="navbar-brand">
                beenthere
              </Link>
              <LoggedOutView currentUser={this.props.user} />
              <LoggedInView currentUser={this.props.user} />
            </div>
          </nav>
      );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Navbar);