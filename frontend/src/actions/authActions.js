import API from "../utils/API";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING
} from "./types";// Register User

export const registerUser = (userData, history) => dispatch => {
  API
    .post("/api/users", userData)
    .then(res => history.push("/")) // re-direct to login on successful register
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - get user token
export const loginUser = userData => dispatch => {
  API
    .post("/api/users/login", userData)
    .then(res => {
      const token  = res.data.user.token;
      // Save to local storage
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      const data = {
        user: res.data.user,
        decoded: decoded
      };
      // Set current user
      dispatch(setCurrentUser(data));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};

// Set logged in user
export const setCurrentUser = data => {
  return {
    type: SET_CURRENT_USER,
    payload: data
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};