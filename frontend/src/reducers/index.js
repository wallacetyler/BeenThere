import { combineReducers } from "redux";
import authReducers from "./authReducers";
import errorReducers from "./errorReducers";
import postReducers from "./postReducers";

export default combineReducers({
  auth: authReducers,
  posts: postReducers,
  errors: errorReducers
});