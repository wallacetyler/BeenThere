import API from "../../utils/API";
import React, { Component } from 'react';
import Mentor from './Mentor.js';
import SearchTag from './SearchTag.js';

import './mentor.css'

const token = localStorage.getItem('jwtToken');

class MentorList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			mentors : [],
			mentorsCount : 0,   // Not used.
			filtrdMentors : [],
			filtrdCount : 0,
			searched_tag : 'all',
			loading: true
		}
		this.onSearchSubmit = this.onSearchSubmit.bind(this);
	}

	componentDidMount() {
		API.get("/api/mentors" , { headers: { Authorization: 'Token ' + token} })
			.then(res => {
				this.setState({
					mentors : res.data.mentors,
					mentorsCount : res.data.mentorsCount,
					filtrdMentors : res.data.mentors,
					filtrdCount : res.data.mentorsCount,
					loading: false
					});
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
		if (tagInput === "") {
		
			this.setState({ searched_tag : tagInput , filtrdMentors : mentors , filtrdCount : mentors.length });
		}
		else {
		
			const foundMentors = mentors.filter(mentor => mentor.tag_list.filter(i => i.toLowerCase().includes(tagInput.toLowerCase())).length >= 1);
			
			this.setState({ searched_tag : tagInput , filtrdMentors : foundMentors , filtrdCount : foundMentors.length });
		}
	}

	render() {
		if(this.state.loading)
			return null;
	
		return (
			<center>
			<div>
				<div className="banner d-flex flex-row justify-content-center align-items-center">
					<h3>Mentors</h3>
				</div>
				<SearchTag
					searched_tag={this.state.searched_tag}
					onSearchSubmit={this.onSearchSubmit}
				/>
				<div className="alert alert-secondary w-50">
					There are {this.state.filtrdCount} mentors with this tag.
				</div>
				<div>
				{
					this.state.filtrdMentors.map((mentor) => {
						return (
								<Mentor
									key={mentor.id}
									first_name={mentor.first_name}
									last_name={mentor.last_name}
									tag_list={mentor.tag_list}
									bio={mentor.bio}
									image={mentor.image}
									id={mentor.id}
								/>
						);
					})
				}
				</div>
			</div>
			</center>
		);
	}
}

export default MentorList;
