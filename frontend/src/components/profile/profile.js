import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';
import './profile.css';

class Profile extends Component {
    constructor(props) {
        super(props);
		
		var profileObjectID = props.location.search.substr(1);
		var IsThisTheAuthenticatedUser = props.auth.user.id === profileObjectID;
		
		this.state = {
            isThisTheAuthenticatedUser: IsThisTheAuthenticatedUser,
			profileFirst: "",
			profileLast: "",
			profileImage: "",
			profileMentor: "",
			profileTagList: [],
			profileAffiliateListString: "",
			profileBio: '',
			nameText: ""
        };
		
		axios.get("/api/profiles/" + profileObjectID).then(
		data => {
			this.setState({nameText: data.data.profile.first_name + " " + data.data.profile.last_name,
				profileFirst: data.data.profile.first_name,
				profileLast: data.data.profile.last_name,
				profileImage: data.data.profile.image,
				profileMentor: (data.data.profile.is_mentor)?"Mentor":"Peer",
				profileTagList: data.data.profile.tag_list,
				profileAffiliateListString: data.data.profile.affiliate_list.join(", "),
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

	affiliateInformation() {
		if(this.state.profileAffiliateListString === "" || this.state.profileMentor === "Peer")
			return;
		else
			return (<p className="t-0 b-2"><b>Affiliated with</b>: {this.state.profileAffiliateListString}</p>);
	}
	
	editProfileClick() {
		document.location.href = "/profileEditor";
	}
	
	editProfileOption() {
		if(this.state.isThisTheAuthenticatedUser)
			return(<button type="button" className="btn btn-outline-dark btn-sm ml-auto" onClick={this.editProfileClick} alt={this.profileFirst}>Edit Profile</button>);
		else 
			return;
	}

    render() {
        return (
			<div className="row" align="middle">
				<div className="banner d-flex flex-column justify-content-center align-items-center">
					<img className="profilePic rounded-circle" src={this.state.profileImage} alt={this.profileFirst} width="50%"/>
					<h4 className="m-1">{this.state.nameText}</h4>
					<h6 className="m-2">{this.state.profileMentor}</h6>
					<div className="d-flex flex-row">
						{this.state.profileTagList.map(
								x => <p className="badge badge-pill badge-light mr-2 mb-1">{x}</p>
						)}
					</div>
				</div>
				<div className="d-flex flex-column justify-content-center w-50 mx-auto">
					<p className="t-2 b-0"><b>Bio</b>: {this.state.profileBio}</p>
					{this.affiliateInformation()}
					{this.editProfileOption()}
				</div>
			</div>
        );
    }
}

Profile.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(
    mapStateToProps
)(Profile);