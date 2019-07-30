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
						<h3>Search Tag:</h3>
						<input placeholder="Tag" ref={tagInput => this.tagInput = tagInput} />
						<button>Search</button>
					</form>
				}
				<div>
					<span>current tag:</span>
					<span>{searched_tag}</span>
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
