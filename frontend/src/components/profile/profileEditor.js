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
		
		this.fNameRef = React.createRef();
	}

    componentDidMount() {
        // If not logged in and tries to load this page, kick them to the login page.
        if (!this.props.auth.isAuthenticated) {
          this.props.history.push("/login");
        }
      }
	
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
				"first_name": this.refs.firstNameRef.innerText,
				"last_name": this.refs.lastNameRef.innerText,
				"profile_image": this.refs.profileImageRef.innerText,
				"affiliate_list": (this.refs.mentorRef.checked)?this.refs.profileAffiliateListRef.innerText.split(", "):undefined,
				"is_mentor": this.refs.mentorRef.checked,
				"tag_list": this.refs.profileTagRef.innerText.split(", "),
				"bio": this.refs.profileBioRef.innerText
			}
		}
		
		axios.put("/api/user", request, auth)
		.then(r => r.status === 200?document.location.href = "/profile?" + id:console.log(r.status))
		.catch(e => console.log(e));
	}
	
	setRadioState(state)
	{
		this.setState({profileIsMentor: state});
	}
	
	doMentorRadioButtons() {
		return(
		<div>
			<label className="container">Mentor
				<input type="radio" checked={this.state.profileIsMentor?"checked":""} name="mentortype" ref={"mentorRef"} onClick={() => this.setRadioState(true)} readOnly={true}/>
			  <span className="radio"></span>
			</label>

			<label className="container">Peer
			  <input type="radio" checked={!this.state.profileIsMentor?"checked":""} name="mentortype" onClick={() => this.setRadioState(false)} readOnly={true}/>
			  <span className="radio"></span>
			</label>
		</div>
		);
	}
	
	doMentorInformation() {
		if(this.state.profileIsMentor)
		{
			return(
				<div className="splitscreen">
					<div className="left">
						<p>Affiliation:</p>
					</div>
					<div className="right">
						<p style={{float:'left'}} className="editable" contentEditable="true" ref={"profileAffiliateListRef"} suppressContentEditableWarning={true}>{this.state.profileAffiliateList.join(", ")}</p>
					</div>
				</div>
			);
		}
	}

	onURLChanged() {
		console.log("F");
	}

    render() {
        return (
			
		<div className="container">
			<div className="row" align="middle">
				<div className="profileCard" minwidth="2500px">
					<div className="splitscreen">
						<div className="leftPicture">
							<img className="profilePic" src={this.state.profileImage} alt={this.profileFirst}/>
						</div>
						<div className="rightPicture">
							<p style={{float:'left'}} className="editable" contentEditable="true" ref={"profileImageRef"} suppressContentEditableWarning={true} onKeyPress={this.onURLChanged()}>{this.state.profileImage}</p>
						</div>
					</div>
					<div className="splitscreen">
						<div className="left">
							<p>First Name:</p>
						</div>
						<div className="right">
							<p style={{float:'left'}} className="editable" contentEditable="true" ref={"firstNameRef"} suppressContentEditableWarning={true}>{this.state.profileFirst}</p>
						</div>
					</div>
					<div className="splitscreen">
						<div className="left">
							<p>Last Name:</p>
						</div>
						<div className="right">
							<p style={{float:'left'}} className="editable" contentEditable="true" ref={"lastNameRef"} suppressContentEditableWarning={true}>{this.state.profileLast}</p>
						</div>
					</div>
					
					{this.doMentorRadioButtons()}
					{this.doMentorInformation()}
					
					<div className="splitscreen">
						<div className="left">
							<p>Tags:</p>
						</div>
						<div className="right">
							<p style={{float:'left'}} className="editable" contentEditable="true" ref={"profileTagRef"} suppressContentEditableWarning={true}>{this.state.profileTagList.join(", ")}</p>
						</div>
					</div>
					<div className="splitscreen">
						<div className="left">
							<p>About Me:</p>
						</div>
						<div className="right">
							<p style={{float:'left'}} className="editable" contentEditable="true" ref={"profileBioRef"} suppressContentEditableWarning={true}>{this.state.profileBio}</p>
						</div>
					</div>
					<input type="image" align="right" src="https://cdn2.iconfinder.com/data/icons/apple-classic/100/Apple_classic_10Icon_5px_grid-04-512.png" width="10%" onClick={() => this.saveButtonClick()} alt="save button"/>
					<input type="image" align="right" src="https://image.flaticon.com/icons/png/512/60/60577.png" width="10%" onClick={() => this.backButtonClick()} alt="back button"/>
				</div>
			</div>
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