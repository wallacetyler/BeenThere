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
				{
					<form 
						onSubmit={this.onSearchSubmit}
						className="d-flex flex-row justify-content-center align-items-center mb-3"
					>
						<label for="tagSearch" className="m-4">
							Search Tag:
						</label>
						<input 
							type="text"
							placeholder="Tag"
							ref={tagInput => this.tagInput = tagInput} 
							className="form-control tagSearch w-25"
						/>
						<button
							type="submit"
							className="btn btn-secondary m-2"
							style={{
								backgroundColor: "#d5a4cf",
								border: "none"
							}}
						>
							Search
						</button>
					</form>
				}
			</div>
  	);
	}
}

export default SearchTag;
