import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";

import "./auth.css";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            password2: "",
            is_mentor: false,
            errors: {},
			errorMessageEmailVisability: false,
			errorMessagePassVisability: false
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
          this.props.history.push("/dashboard");
        }
      }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
          this.setState({
            errors: nextProps.errors
          });
        }
      }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value});
    };

    onSubmit = e => {
        e.preventDefault();

		if (this.state.password !== this.state.password2) {
			this.setState({ errorMessagePassVisability: true });
			return;
		}

        const newUser = {
            user: {
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                password: this.state.password,
                password2: this.state.password2,
                is_mentor: this.state.is_mentor
            }
        };

        this.props.registerUser(newUser, this.props.history);
    };

    render() {
        // Destructuring in react, equivalent to 'const errors = this.state.errors;'
        const { errors } = this.state;

        return (
            <div className="container d-flex flex-row align-items-center">
                <div className="d-flex align-items-center" style={{height: "100vh"}}>
                    <a className="login-text text-align" href="/">a support group<br/>from people who've<br/><span className="login-brand">beenthere</span></a>
                </div>
                <div className="ml-auto d-flex align-items-center">
                    <div>
                        <h4>
                            Register,
                        </h4>
                        <p className="font-weight-light">
                            please fill in the required information below.
                        </p>
                        <form noValidate onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <div className="form-row">
                                    <div className="col">
                                        <label htmlFor="first_name">First Name</label>
                                        <input
                                            onChange={this.onChange}
                                            value={this.state.first_name}
                                            error={errors.first_name}
                                            id="first_name"
                                            type="text"
                                            className={classnames("form-control", {
                                                invalid: errors.name
                                            })}
                                            />
                                        <span className="red-text">{errors.first_name}</span>
                                    </div>
                                    <div className="col">
                                        <label htmlFor="last_name">Last Name</label>
                                        <input
                                            onChange={this.onChange}
                                            value={this.state.last_name}
                                            error={errors.last_name}
                                            id="last_name"
                                            type="text"
                                            className={classnames("form-control", {
                                                invalid: errors.name
                                            })}
                                            />
                                        <span className="red-text">{errors.last_name}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.email}
                                    error={errors.email}
                                    id="email"
                                    type="email"
                                    className={classnames("form-control", {
                                        invalid: errors.email
                                    })}
                                    />
                                <span className="red-text">{errors.email}</span>
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
                                        invalid: errors.password
                                    })}
                                    />
                                <span className="red-text">{errors.password}</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password2">Confirm Password</label>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password2}
                                    error={errors.password2}
                                    id="password2"
                                    type="password"
                                    className={classnames("form-control", {
                                        invalid: errors.password2
                                    })}
                                />
                                <span className="red-text">{errors.password2}</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password2">Do you want to be considered a mentor?</label>
                                <div class="pretty p-default p-round ml-2">
                                    <input 
                                        onChange={this.onChange}
                                        type="radio"
                                        id="is_mentor"
                                        type="checkbox"
                                    />
                                    <div class="state p-success-o">
                                        <label>Yes</label>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-row justify-content-start">
                                <button
                                    type="submit"
                                    className="btn btn-primary mr-2 login-btn"
                                >
                                    Register
                                </button>
                                <Link to="/">
                                    <button
                                        type="button"
                                        className="btn btn-outline-dark"
                                        >
                                        Login
                                    </button>
                                </Link>
                            </div>
                            <div className="col center" id="failed">
                                { this.state.errorMessageEmailVisability ? <p className="red-text font-weight-light">Email already in use!</p> : null } 
                                { this.state.errorMessagePassVisability ? <p className="red-text font-weight-light">Passwords do not match!</p> : null } 
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};
  
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});
  
export default connect(
    mapStateToProps,
    { registerUser }
)(withRouter(Register));