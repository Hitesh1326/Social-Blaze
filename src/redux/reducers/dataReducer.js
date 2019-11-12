import {
  SET_POSTS,
  LOADING_DATA,
  LIKE_POST,
  UNLIKE_POST,
  DELETE_POST,
  CREATE_POST,
  SET_ONEPOST,
  CREATE_COMMENT,
  DELETE_COMMENT
} from "../types";

const initialState = {
  posts: [],
  post: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      };
    case SET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false
      };
    case SET_ONEPOST:
      return {
        ...state,
        post: action.payload
      };
    case LIKE_POST:
        let indexLike = state.posts.findIndex(
          post => post.postId === action.payload.postId
        );
        state.posts[indexLike] = action.payload;
        // if (state.post.postId === action.payload.postId) {
        //   state.post = action.payload;
        // }
        state.post.likeCount++;
        return {
          ...state,
          post: {
            ...state.post,
            // comments: [...state.post.comments]
          }
        };
    case UNLIKE_POST:
      let indexDislike = state.posts.findIndex(
        post => post.postId === action.payload.postId
      );
      state.posts[indexDislike] = action.payload;
      // if (state.post.postId === action.payload.postId) {
      //   state.post = action.payload;
      // }
      state.post.likeCount--;
      return {
        ...state,
        post: {
          ...state.post,
          // comments: [...state.post.comments]
        }
      };
    case DELETE_POST:
      let indexPost = state.posts.findIndex(
        post => post.postId === action.payload
      );
      state.posts.splice(indexPost, 1);
      return {
        ...state
      };
    case CREATE_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      };
    case CREATE_COMMENT:
      let commentIndex = state.posts.findIndex(
        post=> post.postId === action.payload.postId
      );
      state.posts[commentIndex].commentCount++;
        state.post.commentCount++;
      return {
        ...state,
        post: {
          ...state.post,
          comments: [action.payload, ...state.post.comments]
        }
      };
    case DELETE_COMMENT:
      let indexComment = state.post.comments.findIndex(
        comment => comment.commentId === action.payload.comId
      );
      state.post.comments.splice(indexComment, 1);
      state.post.commentCount--;
      let postIndex = state.posts.findIndex(
        post => post.postId === action.payload.posId
      );
      state.posts[postIndex].commentCount--;
      return {
        ...state,
        post: {
          ...state.post,
          comments: [...state.post.comments]
        }
      };
    default:
      return state;
  }
}
