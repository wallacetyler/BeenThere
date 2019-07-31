import API from "../../utils/API";
import React, { Component } from 'react';
import Mentor from './Mentor.js';
import SearchTag from './SearchTag.js';


const token = localStorage.getItem('jwtToken');

class MentorList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			mentors : [],
			mentorsCount : 0,   // Not used.
			filtrdMentors : [],
			filtrdCount : 0,
			searched_tag : 'all'
		}
		this.onSearchSubmit = this.onSearchSubmit.bind(this);
	}

	componentDidMount() {
		API.get("/api/mentors" , { headers: { Authorization: 'Token ' + token} })
			.then(res => {
				console.log(res);
				console.log(res.data);
				console.log(res.data.mentors);
				console.log(res.data.mentorsCount);
				console.log("The type of the fetched data: " + typeof(res.data));
				console.log("The type of the fetched mentors: " + typeof(res.data.mentors));
				console.log("The type of the fetched mentorsCount: " + typeof(res.data.mentorsCount));
				this.setState( {mentors : res.data.mentors} );
				this.setState( {mentorsCount : res.data.mentorsCount} );  // Not used.
				this.setState( {filtrdMentors : res.data.mentors} );
				this.setState( {filtrdCount : res.data.mentorsCount} );
				console.log("The type of the mentors: " + typeof(this.state.mentors));
				console.log("The type of the mentorsCount: " + typeof(this.state.mentorsCount));
			})
			.catch(err => {
				console.log(err);
				console.log("Error");
			})
	}

	getMentors() {
		return this.state.mentors;
	}

	onSearchSubmit(tagInput) {
		console.log("The input tag is: " + tagInput);
		const mentors = this.getMentors();
		if (tagInput == "all") {
			console.log("The input tag equals 'all'");
			console.log(mentors);
			this.setState({ searched_tag : tagInput , filtrdMentors : mentors , filtrdCount : mentors.length });
		}
		else {
			console.log("The input tag does not equal 'all'");
			const foundMentors = mentors.filter(mentor => {
				var swtch = false;
				for (var i = 0, len = mentor.tag_list.length; i < len; i++) {
					if (mentor.tag_list[i] == tagInput) {
						swtch = true;
					}
				}
				if (swtch == true) {
					return mentor;
				}
			});
			console.log(foundMentors);
			this.setState({ searched_tag : tagInput , filtrdMentors : foundMentors , filtrdCount : foundMentors.length });
		}
	}

	render() {
		return (
			<center>
			<div>
				<h3>Mentors</h3>
				<SearchTag
					searched_tag={this.state.searched_tag}
					onSearchSubmit={this.onSearchSubmit}
				/>
				<div>
					There are {this.state.filtrdCount} mentors with this tag.
				</div>
				<div>
					......
				</div>
				{
					this.state.filtrdMentors.map((mentor) => {
						return (
							<Mentor
								// A more permenant key is needed.
								key={mentor.last_name}
								first_name={mentor.first_name}
								last_name={mentor.last_name}
								tag_list={mentor.tag_list}
								bio={mentor.bio}
								image={mentor.image}
							/>
						);
					})
				}
			</div>
			</center>
		);
	}
}

export default MentorList;
