import React, { Component } from 'react';

class Mentor extends Component {
	constructor(props) {
		super(props);
		this.state = { };
	}

	render() {
		const { first_name, last_name, tag_list, bio, image } = this.props;

		return (
			<div>
				<div>
					<span>{image}</span>
					<span>{first_name}</span>
					<span>{last_name[0]}</span>
				</div>
				<div>
					<span>Tags:</span>
					<span>
					{
						tag_list.map((tag) => {
							return tag;
						})
					}
					</span>
				</div>
				<div>
					<span>Bio:</span>
					<span>{bio}</span>
				</div>
				<div>
					...
				</div>
			</div>

  	);
	}
}

export default Mentor;
