import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";

import "./login.css";

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
            <div className="container">
				<div className="row justify-content-start h-50">
					<div className="col-md-4" style={{marginTop:"100px"}}>
						<img src="./beentherelogo2.png" alt="logo" className="img-fluid" />
					</div>
				</div>
                <div className="row d-flex justify-content-end h-100">
                    <div className="col-md-4 white shadow p-3 mb-5 rounded my-auto">
                        <div className="col">
                            <h4 className="text-center">
                                Register here!
                            </h4>
                        </div>
                        <form noValidate onSubmit={this.onSubmit}>
                            <div className="input-field col">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.first_name}
                                    error={errors.first_name}
                                    id="first_name"
                                    type="text"
                                    className={classnames("", {
                                        invalid: errors.name
                                    })}
                                />
                                <label htmlFor="first_name">First Name</label>
                                <span className="red-text">{errors.first_name}</span>
                            </div>
                            <div className="input-field col">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.last_name}
                                    error={errors.last_name}
                                    id="last_name"
                                    type="text"
                                    className={classnames("", {
                                        invalid: errors.name
                                    })}
                                />
                                <label htmlFor="last_name">Last Name</label>
                                <span className="red-text">{errors.last_name}</span>
                            </div>
                            <div className="input-field col">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.email}
                                    error={errors.email}
                                    id="email"
                                    type="email"
                                    className={classnames("", {
                                        invalid: errors.email
                                    })}
                                />
                                <label htmlFor="email">Email</label>
                                <span className="red-text">{errors.email}</span>
                            </div>
                            <div className="input-field col">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password}
                                    error={errors.password}
                                    id="password"
                                    type="password"
                                    className={classnames("", {
                                        invalid: errors.password
                                    })}
                                />
                                <label htmlFor="password">Password</label>
                                <span className="red-text">{errors.password}</span>
                            </div>
                            <div className="input-field col">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password2}
                                    error={errors.password2}
                                    id="password2"
                                    type="password"
                                    className={classnames("", {
                                        invalid: errors.password2
                                    })}
                                />
                                <label htmlFor="password2">Confirm Password</label>
                                <span className="red-text">{errors.password2}</span>
                            </div>
							<div className="col center">
								<div className="col s8">
									<p className="grey-text font-weight-light">
										Are you going to be a mentor?
									</p>
								</div>
								<div className="switch col s4">
									<label>
										No
										<input 
											onChange={this.onChange}
											type="checkbox"
											id="is_mentor"
											value="true"
										/>
										<span className="lever" style={{marginLeft:"5px", marginRight:"5px"}}></span>
										Yes
									</label>
								</div>
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
                                    Register
                                </button>
                            </div>
							<div className="col center">
								<p className="grey-text font-weight-light">
									If you have an account, <Link to="/">Login</Link> here!
								</p>
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