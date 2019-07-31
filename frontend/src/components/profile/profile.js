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
			return (<p>Affiliated with: {this.state.profileAffiliateListString}</p>);
	}
	
	editProfileClick() {
		document.location.href = "/profileEditor";
	}
	
	editProfileOption() {
		if(this.state.isThisTheAuthenticatedUser)
			return(<input type="image" align="right" src="https://icons-for-free.com/iconfiles/png/512/gear-131965017453293218.png" width="10%" onClick={this.editProfileClick} alt={this.profileFirst}/>);
		else 
			return;
	}

    render() {
        return (
			
		<div className="container">
			<div className="row" align="middle">
				<div className="profileCard" align="middle">
					<img className="profilePic" src={this.state.profileImage} alt={this.profileFirst} width="50%"/>
					<h4>{this.state.nameText}</h4>
					<p className="title">{this.state.profileMentor}</p>
					{this.affiliateInformation()}
					<p>About <b>{this.state.nameText}</b>: {this.state.profileBio}</p>
					{this.editProfileOption()}
					
				</div>
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