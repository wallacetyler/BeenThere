import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";

import "./login.css";

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
        // If logged in and user navigates to Login page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
          this.props.history.push("/dashboard");
        }
      }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
          this.props.history.push("/dashboard"); // push user to dashboard when they login
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
            <div className="container">
				<div className="row justify-content-start h-50">
					<div className="col-md-4" style={{marginTop:"100px", marginBottom:"100px"}}>
						<img src="./beentherelogo2.png" alt="logo" className="img-fluid" />
					</div>
				</div>
                <div className="row d-flex justify-content-end h-100">
                    <div className="col-md-4 white shadow p-3 mb-5 rounded my-auto">
                        <div className="col">
                            <h4 className="text-center">
                                Don't keep us waiting!
                            </h4>
                            <p className="text-center font-weight-light">
                                Login now!
                            </p>
                        </div>
                        <form noValidate onSubmit={this.onSubmit}>
                            <div className="input-field col">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.email}
                                    error={errors.email}
                                    id="email"
                                    type="text"
                                    className={classnames("", {
                                        invalid: errors.email || errors.emailnotfound
                                      })}
                                />
                                <label htmlFor="email">Email</label>
                                <span className="red-text">
                                    {errors.email}
                                    {errors.emailnotfound}
                                </span>
                            </div>
                            <div className="input-field col">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password}
                                    error={errors.password}
                                    id="password"
                                    type="password"
                                    className={classnames("", {
                                        invalid: errors.password || errors.passwordincorrect
                                      })}
                                />
                                <label htmlFor="password">Password</label>
                                <span className="red-text">
                                    {errors.password}
                                    {errors.passwordincorrect}
                                </span>
                            </div>
                            <div className="col center">
                                <button
                                    style={{
                                        width: "150px",
                                        borderRadius: "3px",
                                        letterSpacing: "1.5px",
                                        marginTop: "1rem",
										marginBottom: "5px"
                                    }}
                                    type="submit"
                                    className="rounded-pill btn btn-large waves-effect waves-light hoverable purple accent-1 border-light"
                                >
                                    Login
                                </button>
                            </div>
							<div className="col center">
								<p className="grey-text font-weight-light">
									If you don't have an account, <Link to="/register">Register</Link> here!
								</p>
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