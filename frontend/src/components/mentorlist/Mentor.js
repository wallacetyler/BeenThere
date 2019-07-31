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
					<img src={image} />
					<a href="Link_to_the_Profile"> {first_name} {last_name[0]} </a>
				</div>
				<div>
					Tags:
					{
						tag_list.map((tag) => {
							return tag;
						})
					}
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
