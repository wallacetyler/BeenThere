import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const token = localStorage.getItem('jwtToken');

const Post = props => (
    <tr>
        <td>{props.post.title}</td>
        <td>{props.post.description}</td>
        <td>{props.post.body}</td>
        <td>
            <Link to={"/editpost?"+props.post.slug}>Edit</Link>
        </td>
    </tr>
)


export default class Forum extends Component {

	constructor(props) {
        super(props);
        this.state = {
			posts: [],
			postCount: 0
			};

        this.postList = this.postList.bind(this);
    }

	componentDidMount() {
		const auth = 
		{
			headers:
			{
				Authorization: "Token " + token
			}
		};
		
        axios.get('/api/posts/', auth)
            .then(response => {
                this.setState({ 
					posts: response.data.posts,
					postCount: response.data.postCount
					});
            })
            .catch(function (error){
                console.log(error);
            })
    }

    postList() {
        return this.state.posts.map(function(currentPost, i){
            return <Post post={currentPost} key={i} />;
        })
    }

    render() {
        return (
            <div>
                <h3>Forum</h3>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Body</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.postList() }
                    </tbody>
                </table>
            </div>
        )
    }
}