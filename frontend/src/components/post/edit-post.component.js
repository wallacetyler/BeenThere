import React, { Component } from 'react';
import axios from 'axios';

const token = localStorage.getItem('jwtToken');

export default class EditPost extends Component {

	constructor(props) {
        super(props);

        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeBody = this.onChangeBody.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

		const postSlug = props.location.search.substr(1);
		
        this.state = {
            post: undefined,
			loaded: false,
			title: '',
			description: '',
			body: '',
			slug: postSlug
        }
		
		const auth = 
		{
			headers:
			{
				Authorization: "Token " + token
			}
		};
		
		const apiString = "/api/posts/" + postSlug;
		
		axios.get(apiString, auth)
            .then(response => {
                this.setState({ 
					post: response.data.post,
					loaded: true,
					body: response.data.post.body,
					description: response.data.post.description,
					title: response.data.post.title
					});
					
			
            })
            .catch(function (error){
                console.log(error);
            });
    }

    onChangeTitle(e) {
        this.setState({
            title: e.target.value
        });
    }

    onChangeDescription(e) {
        this.setState({
            description: e.target.value
        });
    }

    onChangeBody(e) {
        this.setState({
            body: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();
        const editedPost = 
		{
			post:
			{
				title: this.state.title,
				description: this.state.description,
				body: this.state.body
			}
        };
		const auth = 
		{
			headers:
			{
				Authorization: "Token " + token
			}
		};
		
        axios.put('http://localhost:5000/api/posts/' + this.state.slug, editedPost, auth)
            .then(res => 
			{
				console.log(res.data);
				this.props.history.push('/posts');
			})
		;
    }

    render() {
		if(!this.state.loaded)
			return null;
	
        return (
            <div>
                <h3 align="center">Edit Post</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group"> 
                        <label>Title: </label>
                        <input  type="text"
                                className="form-control"
                                defaultValue={this.state.title}
                                onChange={this.onChangeTitle}
                                />
                    </div>
                    <div className="form-group">
                        <label>Description: </label>
                        <input 
                                type="text" 
                                className="form-control"
                                defaultValue={this.state.description}
                                onChange={this.onChangeDescription}
                                />
                    </div>
                    <div className="form-group">
                        <label>Body: </label>
                        <input 
                                type="text" 
                                className="form-control"
                                defaultValue={this.state.body}
                                onChange={this.onChangeBody}
                                />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Update Post" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}