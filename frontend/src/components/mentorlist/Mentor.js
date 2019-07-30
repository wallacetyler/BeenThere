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
					<img src={image} /> {first_name} {last_name[0]}
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
