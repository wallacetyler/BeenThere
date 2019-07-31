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
				<div className="d-flex flex-row mb-4" style={{width: "500px"}}>
					<div>
						<img src={image} alt={last_name} className="mentor-img rounded-circle" />
					</div>
					<div className="ml-4 text-left">
						<a href={profileURL}
							className="name"
						> {first_name.charAt(0).toUpperCase() + first_name.slice(1)} {last_name.charAt(0).toUpperCase()} </a>
						<br />
						{tag_list.map(
							x => <p className="badge badge-pill badge-dark mr-2 mb-1">{x}</p>
						)}
						<p className="d-block text-truncate" style={{maxWidth: "400px"}}>{bio}</p>
					</div>
				</div>

  	);
	}
}

export default Mentor;
