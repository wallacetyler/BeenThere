import React, { Component } from 'react';
import axios from 'axios';
import './post.css';

const token = localStorage.getItem('jwtToken');


export default class createPost extends Component {

	constructor(props) {
        super(props);

        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeBody = this.onChangeBody.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            title: '',
            description: '',
            body: ''
        }
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
        
        const auth = 
		{
			headers:
			{
				Authorization: "Token " + token
			}
		};
		
        const newPost = 
		{
			post:
			{
				title: this.state.title,
				description: this.state.description,
				body: this.state.body
			}
        };

        axios.post('/api/posts/', newPost, auth)
		.then(resp => { if(resp.status == 200) document.location.href = "/feed"; });
        
        this.setState({
            title: '',
            description: '',
            body: ''
        })
    }

    render() {
        return (
            <div>
                <div className="banner d-flex flex-row justify-content-center align-items-center">
                    <h3>Create Post</h3>
                </div>
                    <div className="container d-flex justify-content-center">
                        <form onSubmit={this.onSubmit} className="create-post my-4">
                            <div className="form-group"> 
                                <label>Title: </label>
                                <input  type="text"
                                        className="form-control"
                                        value={this.state.title}
                                        onChange={this.onChangeTitle}
                                        />
                            </div>
                            <div className="form-group">
                                <label>Description: </label>
                                <input 
                                        type="text" 
                                        className="form-control"
                                        value={this.state.description}
                                        onChange={this.onChangeDescription}
                                        />
                            </div>
                            <div className="form-group">
                                <label>Body: </label>
                                <textarea 
                                        type="text" 
                                        className="form-control"
                                        value={this.state.body}
                                        onChange={this.onChangeBody}
                                        />
                            </div>
                            <div className="form-group">
                                <button type="submit" value="Create Post" className="btn btn-primary post-btn">
                                    Create Post    
                                </button>
                            </div>
                        </form>
                    </div>
            </div>
 
        )
    }
}