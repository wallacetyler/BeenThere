import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";

import "./auth.css";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            errors: {},
			errorMessageVisability: false
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Login page, should redirect them to feed
        if (this.props.auth.isAuthenticated) {
          this.props.history.push("/feed");
        }
      }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
          this.props.history.push("/feed"); // push user to feed when they login
        }
		else {
			this.setState({ errorMessageVisability: true });
		}
        if (nextProps.errors) {
          this.setState({
            errors: nextProps.errors
          });
        }
      }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();

        const userData = {
            user: {
                email: this.state.email,
                password: this.state.password
            }
        };
        
        // Since we handle the redirect within our component, we don't 
        // need to pass in this.props.history as a parameter
        this.props.loginUser(userData); 
    };

    render() {
        const { errors } = this.state;

        return (
            <div className="container d-flex flex-row align-items-center">
                <div className="d-flex align-items-center" style={{height: "100vh"}}>
                    <a className="login-text text-align" href="/">a support group<br/>from people who've<br/><span className="login-brand">beenthere</span></a>
                </div>
                <div className="ml-auto d-flex align-items-center">
                    <div>
                        <h4>
                            Welcome back,
                        </h4>
                        <p className="font-weight-light">
                            please login to your account or register below.
                        </p>
                        <form noValidate onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.email}
                                    error={errors.email}
                                    id="email"
                                    type="email"
                                    className={classnames("form-control", {
                                        invalid: errors.email || errors.emailnotfound
                                        })}
                                />
                                <span className="red-text">
                                    {errors.email}
                                    {errors.emailnotfound}
                                </span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password}
                                    error={errors.password}
                                    id="password"
                                    type="password"
                                    className={classnames("form-control", {
                                        invalid: errors.password || errors.passwordincorrect
                                        })}
                                />
                                <span className="red-text">
                                    {errors.password}
                                    {errors.passwordincorrect}
                                </span>
                            </div>
                            <div className="d-flex flex-row justify-content-start">
                                <button
                                    type="submit"
                                    className="btn btn-primary mr-2 login-btn"
                                >
                                    Login
                                </button>
                                <Link to="/register">
                                    <button
                                        type="button"
                                        className="btn btn-outline-dark"
                                        >
                                        Register
                                    </button>
                                </Link>
                            </div>
                            <div className="col center" id="failed">
                                { this.state.errorMessageVisability ? <p className="red-text font-weight-light">Invalid email or password.</p> : null } 
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { loginUser }
)(Login);