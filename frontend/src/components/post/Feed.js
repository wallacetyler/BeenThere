import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    loadPosts
} from './../../actions/postActions';

const mapStateToProps = state => {
    return {
        posts: state.posts.posts.posts
    }
}

class Feed extends Component {
    componentWillReceiveProps(nextProps) {

    }

    componentWillMount() {
        this.props.loadPosts()
    }

    render() {
        if (this.props && this.props.posts) {
            var posts = this.props.posts.map((post) => 
                <div className="post">
                    <hr/>
                    <div className="post-metadata d-flex flex-row align-items-center">
                        <div className="main-body d-flex flex-column mb-2">
                            <h3 className="post-title mb-0"><a href={`/post/${post.slug}`}>{post.title}</a></h3>
                            <p className="post-description m-0">{post.description}</p>
                            {/* <p className="post-body">{post.body}</p> */}
                            <a className="read-more" href={`/post/${post.slug}`}>read more...</a>
                        </div>
                        <div className="post-info d-flex flex-row align-items-center ml-auto">
                            <img alt="" className="rounded-circle feed-post-avatar" src={post.author.image} height="40" width="40"/>
                            <div className="d-flex flex-column ml-2">
                                <span className="feed-post-author"><a href={`/profile?${post.author.id}`}>{post.author.first_name} {post.author.last_name.charAt(0)}</a></span>
                                <p className="m-0">{post.createdAt.slice(0, 10)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    
            return (
                <div>
                    <div className="banner d-flex flex-row justify-content-center align-items-center">
                        <h3>Posts</h3>
                    </div>
                        <div className="container d-flex justify-content-center my-4">
                            <div className="post-feed">
                                { this.props && this.props.posts && <div>{posts}</div> }
                            </div>
                        </div>
                </div>
            )
    }
}

export default connect(mapStateToProps, { loadPosts, pure: false })(Feed);