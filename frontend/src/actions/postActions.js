import API from '../utils/API';

import {
    LOAD_POSTS,
    VIEW_POST,
    LOAD_COMMENTS,
    POST_COMMENT,
    DELETE_COMMENT
  } from "../actions/types";

export function loadPosts() {
    return (dispatch) => {
        API.get('api/posts')
            .then((res) => {
                let posts = res.data
                dispatch({type:LOAD_POSTS, posts})
            }).catch((err) => {
                console.log(err)
            })
    }
}

export function getPost(post_slug) {
    return (dispatch) => {
        API.get(`api/posts/${post_slug}`)
            .then((res) => {
                let post = res.data
                dispatch({type:VIEW_POST, post})
            }).catch((err) => {
                console.log(err)
            })
    }
}

export function loadComments(post_slug) {
    return (dispatch) => {
        API.get(`api/posts/${post_slug}/comments`)
            .then((res) => {
                let comments = res.data
                dispatch({type:LOAD_COMMENTS, comments})
            }).catch((err) => {
                console.log(err)
            })
    }
}

export function postComment(post_slug, token, comment) {
    return (dispatch) => {
        API.post(`api/posts/${post_slug}/comments`, comment, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
            .then((res) => {
                console.log(res)
                dispatch({type:POST_COMMENT, comment})
				//if the comment was successfully posted then refresh the pageX
				if(res.status == 200)
					document.location.reload();
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

export function comment() {
    return (dispatch) => {

    }
}