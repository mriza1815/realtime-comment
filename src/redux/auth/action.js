//Action Types
export const MAKE_LOGIN = "MAKE_LOGIN";
export const MAKE_LOGOUT = "MAKE_LOGOUT";
export const SET_FOLLOWERS = "SET_FOLLOWERS";
export const SET_REACTIONS = "SET_REACTIONS";
export const SET_RESTRICTED_WORDS = "SET_RESTRICTED_WORDS";

//Action Creator
export const makeLogin = (payload) => ({ type: MAKE_LOGIN, payload });
export const makeLogout = () => ({ type: MAKE_LOGOUT });
export const setFollowers = (payload) => ({ type: SET_FOLLOWERS, payload });
export const setReactions = (payload) => ({ type: SET_REACTIONS, payload });
export const setRestrictedWords = (payload) => ({
  type: SET_RESTRICTED_WORDS,
  payload,
});
