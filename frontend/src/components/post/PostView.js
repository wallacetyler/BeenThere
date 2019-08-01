import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    getPost,
    loadComments,
    postComment
} from './../../actions/postActions';

import './post.css';

const mapStateToProps = state => {
    return {
        _post: state.posts.post.post,
        _comments: state.posts.comments.comments,
        user: state.auth.user
    }
}

class PostView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newComment: ""
        };
    }
    
    componentDidMount() {
        document.body.className = 'posts show'
    }

    componentWillMount() {
        this.props.getPost(this.props.match.params.slug);
        this.props.loadComments(this.props.match.params.slug);
    }

    componentWillUnmount() {
        document.body.className = ''
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    handleSubmit = e => {
        e.preventDefault();
        const newComment = {
            comment: {
                body: this.state.newComment
            }
        };
        this.props.postComment(this.props.match.params.slug, localStorage.jwtToken, newComment); 
        this.setState({ newComment: "" })
        
    };

    render() {
        if (this.props && this.props._post) {
            var _post = this.props._post
            var author = this.props._post.author

            var post = (
                <div>
                    <div className="banner d-flex flex-row justify-content-start align-items-center">
                        <div className="container">
                            <div className="d-flex flex-column">
                                    <h4 className="post-title">{_post.title}</h4>
                                <div className="d-flex flex-row align-items-center mt-4">
                                    <img alt="" className="post-avatar-image rounded-circle" src={_post.author.image} height="40" width="40"/>
                                    <div className="post-info d-flex flex-column ml-2">
                                        <p className="post-author m-0">{_post.author.first_name} {_post.author.last_name.charAt(0)}</p>
                                        <p className="post-date m-0">{_post.createdAt.slice(0, 10)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="my-4">
                            <p className="post-text">{_post.body}</p>
                        </div>
                        <hr />
                    </div>
                </div>
            )

            var comment = (
                <div className="container">
                    <form className="card comment-form mb-4" onSubmit={this.handleSubmit.bind(this)}>
                        <div className="card-block">
                            <textarea 
                                id="newComment"
                                onChange={this.onChange}
                                value={this.state.newComment}
                                className="form-control comment-text-area" 
                                placeholder="Write a comment..." 
                                rows="3"
                            />
                        </div>
                        <div className="card-footer d-flex flex-row align-items-center">
                            <button
                                type="submit"
                                className="btn btn-primary ml-auto comment-btn"
                            >
                                Post Comment
                            </button>
                        </div>
                    </form>
                </div>
            )

            if (this.props && this.props._comments) {
                var comments =(
                    this.props._comments.map((comment) => 
                        <div>
                            <div className="card comment-card mb-3">
                                <div className="card-body">
                                    <p className="card-text comment-text">{comment.body}</p>
                                </div>
                                <div className="card-footer d-flex flex-row align-items-center">
                                    <img alt="" className="comment-avatar-image rounded-circle" src={comment.author.image} />
                                    <a className="comment-author ml-2 mb-0" href={`/profile/${comment.author.id}`}>{comment.author.first_name} {comment.author.last_name.charAt(0)}</a>
                                    <p className="comment-date ml-2 mb-0">{comment.createdAt}</p>
                                </div>
                            </div>
                        </div>
                    )

                )
            }

        }
    
        return (
            <div>
                { this.props && this.props._post && <div>{post}</div> }
                { this.props && this.props._post && <div>{comment}</div> }
                <div className="container">
                    { this.props && this.props._comments && <div>{comments}</div> }
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, { getPost, loadComments, postComment, pure: false })(PostView);