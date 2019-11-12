import {
  SET_POSTS,
  LOADING_DATA,
  LIKE_POST,
  UNLIKE_POST,
  DELETE_POST,
  CREATE_POST,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_ONEPOST,
  STOP_LOADING_UI,
  CREATE_COMMENT,
  DELETE_COMMENT
} from "../types";
import axios from "axios";

//Get all posts
export const getPosts = () => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/posts")
    .then(res => {
      dispatch({
        type: SET_POSTS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: SET_POSTS,
        payload: []
      });
    });
};

//get one post
export const getOnePost = postId => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/post/${postId}`)
    .then(res => {
      dispatch({
        type: SET_ONEPOST,
        payload: res.data
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch(err => console.log(err));
};

//Create post
export const createPost = newPost => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/createPost", newPost)
    .then(res => {
      dispatch({ type: CREATE_POST, payload: res.data });
      dispatch(clearErrors());
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

//Like post
export const likePost = postId => dispatch => {
 
  axios
    .get(`/post/${postId}/like`)
    .then(res => {
      dispatch({
        type: LIKE_POST,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

//Unlike post
export const unlikePost = postId => dispatch => {
  axios
    .get(`/post/${postId}/unlike`)
    .then(res => {
      dispatch({
        type: UNLIKE_POST,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

//delete post
export const deletePost = postId => dispatch => {
  axios
    .delete(`/post/${postId}`)
    .then(() => {
      dispatch({ type: DELETE_POST, payload: postId });
    })
    .catch(err => console.log(err));
};

//post comment
export const createComment = (postId, commentData) => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post(`/post/${postId}/comment`, commentData)
    .then(res => {
      dispatch({ type: CREATE_COMMENT, payload: res.data });
      dispatch(clearErrors());
    })
    .catch(err => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

//delete comment 
export const deleteComment = (postId,commentId) => dispatch => {
  axios.delete(`/comment/${commentId}`)
  .then(()=> {
    dispatch({type: DELETE_COMMENT, payload: {comId: commentId, posId: postId}});

  }).catch(err => console.log(err));
}

export const getUserData = userHandle => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/${userHandle}`)
    .then(res => {
      dispatch({
        type: SET_POSTS,
        payload: res.data.posts
      });
    })
    .catch(err => {
      dispatch({ type: SET_POSTS, payload: null });
    });
};

export const clearErrors = () => dispatch => {
  dispatch({ type: CLEAR_ERRORS });
};
