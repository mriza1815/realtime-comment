import {
  MAKE_LOGIN,
  MAKE_LOGOUT,
  SET_FOLLOWERS,
  SET_REACTIONS,
  SET_RESTRICTED_WORDS,
} from "./action";

const initialState = {
  user: null,
  loggedIn: false,
  followings: [],
  followerCount: 0,
  reactions: [],
  restrictedWords: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case MAKE_LOGIN:
      return { ...state, user: action.payload, loggedIn: true };
    case MAKE_LOGOUT:
      localStorage.removeItem("persist:realtimecomment:root");
      return { ...state, user: null, loggedIn: false };
    case SET_FOLLOWERS:
      const { followings, followerCount } = action.payload;
      return {
        ...state,
        followings,
        followerCount,
      };
    case SET_REACTIONS:
      return {
        ...state,
        reactions: action.payload,
      };
    case SET_RESTRICTED_WORDS:
      return {
        ...state,
        restrictedWords: action.payload,
      };
    default:
      return { ...state };
  }
};

export default reducer;
