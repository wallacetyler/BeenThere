import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';
import './profile.css';

const token = localStorage.getItem('jwtToken');

class ProfileEditor extends Component {
    constructor(props) {
        super(props);
		
		this.state = {
			profileFirst: "",
			profileLast: "",
			profileImage: "",
			profileIsMentor: undefined,
			profileTagList: [],
			profileAffiliateList: [],
			profileBio: '',
			userID: props.auth.user.id
        };
		
		axios.get("/api/profiles/" + props.auth.user.id).then(
		data => {
			this.setState({
				profileFirst: data.data.profile.first_name,
				profileLast: data.data.profile.last_name,
				profileImage: data.data.profile.image,
				profileIsMentor: data.data.profile.is_mentor,
				profileTagList: data.data.profile.tag_list,
				profileAffiliateList: data.data.profile.affiliate_list,
				profileBio: data.data.profile.bio
				});
		})
		.catch(error => {
			console.log(error);
			document.location.href = "/dashboard";
		});
	}

    componentDidMount() {
        // If not logged in and tries to load this page, kick them to the login page.
        if (!this.props.auth.isAuthenticated) {
          this.props.history.push("/login");
        }
      }
	
	onChange = e => {
		this.setState({ [e.target.id]: e.target.value});
    };

	backButtonClick() {
		document.location.href = "/profile?" + this.state.userID;
	}
	
	saveButtonClick() {
		var id = this.state.userID;
		
		const auth = 
		{
			headers:
			{
				Authorization: "Token " + token
			}
		};

		const request = 
		{
			"user":
			{
				"first_name": this.refs.firstNameRef.value,
				"last_name": this.refs.lastNameRef.value,
				"profile_image": this.refs.profileImageRef.value,
				"affiliate_list": (this.refs.mentorRef.checked)?this.refs.profileAffiliateListRef.value.split(", "):undefined,
				"is_mentor": this.refs.mentorRef.checked,
				"tag_list": this.refs.profileTagRef.value.split(", "),
				"bio": this.refs.profileBioRef.value
			}
		}
		
		axios.put("/api/user", request, auth)
		.then(r => r.status === 200?document.location.href = "/profile?" + id:console.log(r.status))
		.catch(e => console.log(e));
	}
	
	doMentorInformation() {
		if(this.state.profileIsMentor)
		{
			return(
				<div className="form-group">
					<label htmlFor="bio">Are you affiliated with any companies? (comma seperated)</label>
					<textarea className="form-control" id="affiliateList" rows="3" value={this.state.profileAffiliateList.join(', ')} ref={"profileAffiliateListRef"}></textarea>
				</div>
			);
		}
	}

	assignMentorValue() {
		
		this.setState({ profileIsMentor: this.refs.mentorRef.checked});
		console.log(this.state.profileIsMentor);
	}

    render() {
        return (
			<div>
				<div className="banner d-flex flex-row justify-content-center align-items-center mb-3">
					<h3>Edit Profile</h3>
				</div>
				<form className="mx-auto w-50">
					<div className="form-group">
						<label htmlFor="profilePic">Profile Picture</label>
						<input 
							type="text"
							className="form-control"
							id="profilePic" 
							value={this.state.profileImage}
							onChange={this.onChange}
							ref={"profileImageRef"}
						></input>
					</div>
					<div className="form-row">
						<div className="form-group col-md-6">
							<label htmlFor="firstName">First Name</label>
							<input type="text" className="form-control" id="firstName" value={this.state.profileFirst} ref={"firstNameRef"} onChange={this.onChange}></input>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="lastName">Last Name</label>
							<input type="text" className="form-control" id="lastName" value={this.state.profileLast} ref={"lastNameRef"} onChange={this.onChange}></input>
						</div>
					</div>
					<div className="form-check d-flex">
						<input type="checkbox" className="form-check-input" id="mentor" value={this.state.profileIsMentor} onClick={() => this.assignMentorValue()} ref={"mentorRef"}></input>
						<label className="form-check-label" htmlFor="mentor">Would you like to be considered a mentor? (your profile will be public)</label>
					</div>
					{this.doMentorInformation()}
					<div className="form-group mt-3">
						<label htmlFor="tags">Where have you been? (Tags comma separated)</label>
						<input type="text" className="form-control" id="tags" value={this.state.profileTagList} ref={"profileTagRef"} onChange={this.onChange}></input>
					</div>
					<div className="form-group">
						<label htmlFor="bio">Explain more about yourself</label>
						<textarea className="form-control" id="bio" rows="3" value={this.state.profileBio} ref={"profileBioRef"} onChange={this.onChange}></textarea>
					</div>
					<div className="d-flex flex-row-reverse">
						<button className="btn btn-success ml-2" type="button" onClick={() => this.saveButtonClick()} alt="save button">
							Save
						</button>
						<button className="btn btn-dark ml-2" type="button" onClick={() => this.backButtonClick()} alt="back button">
							Cancel
						</button>
					</div>
				</form>
			</div>
		);
    }
}

ProfileEditor.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(
    mapStateToProps
)(ProfileEditor);