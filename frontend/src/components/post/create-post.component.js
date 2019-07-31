import React, { Component } from 'react';
import axios from 'axios';

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
        
        console.log(`Post submitted:`);
        console.log(`Title: ${this.state.title}`);
        console.log(`Description: ${this.state.description}`);
        console.log(`Body: ${this.state.body}`);
        
        const newPost = {
            title: this.state.title,
            description: this.state.description,
            body: this.state.body
        };

        axios.post('http://localhost:5000/api/posts/', newPost)
            .then(res => console.log(res.data));
        
        this.setState({
            title: '',
            description: '',
            body: ''
        })
    }

    render() {
        return (
            <div style={{marginTop: 10}}>
            	<h3>Create Post</h3>
                <form onSubmit={this.onSubmit}>
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
                        <input 
                                type="text" 
                                className="form-control"
                                value={this.state.body}
                                onChange={this.onChangeBody}
                                />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Create Post" className="btn btn-primary" />
                    </div>
                </form>
            </div>
 
        )
    }
}