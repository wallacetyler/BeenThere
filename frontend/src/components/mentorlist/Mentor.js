import React, { Component } from 'react';

class Mentor extends Component {
	constructor(props) {
		super(props);
		this.state = { };
	}

	render() {
		const { first_name, last_name, tag_list, bio, image, id } = this.props;
		
		const profileURL = "profile?"+id;

		return (
			<div>
				<div>
					<img src={image} alt={last_name}/>
					<a href={profileURL}> {first_name} {last_name} </a>
				</div>
				<div>
					Tags: {tag_list.join(", ")}
				</div>
				<div>
					Bio: {bio}
				</div>
				<div>
					...
				</div>
			</div>

  	);
	}
}

export default Mentor;
