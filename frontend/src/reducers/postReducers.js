import {
    LOAD_POSTS,
    VIEW_POST,
    LOAD_COMMENTS,
    POST_COMMENT,
    DELETE_COMMENT
  } from "../actions/types";

const initialState = {
    posts: [],
    post: {},
    comments: []
}

export default (state=initialState, action) => {
    switch (action.type) {
        case LOAD_POSTS:
            return {
                ...state,
                posts: action.posts
            }
        case VIEW_POST:
            return {
                ...state,
                post: action.post
            }
        case LOAD_COMMENTS:
            return {
                ...state,
                comments: action.comments
            }
        case POST_COMMENT:
            return {
                ...state,
            }
        case DELETE_COMMENT:
            return {
                ...state,
                comment: state.comments.filter(comment => comment.id !== comment.id)
            }
        default:
            console.log('Inside')
            return state
    }
}