import React, { Component } from 'react';


class SearchTag extends Component {
	constructor(props) {
		super(props);
		this.state = { };
		this.onSearchSubmit = this.onSearchSubmit.bind(this);
	}

	onSearchSubmit(event) {
		event.preventDefault();
		this.props.onSearchSubmit(this.tagInput.value);
	}

	render() {
		const { searched_tag } = this.props;

		return (
			<div>
				<hr />
				{
					<form onSubmit={this.onSearchSubmit}>
						Search Tag:
						<input placeholder="Tag" ref={tagInput => this.tagInput = tagInput} />
						<button>Search</button>
					</form>
				}
				<div>
					current tag: {searched_tag}
				</div>
				<div>
					Note: To get all tags search "all"
				</div>
				<hr />
				<div>
					......
				</div>
			</div>
  	);
	}
}

export default SearchTag;
