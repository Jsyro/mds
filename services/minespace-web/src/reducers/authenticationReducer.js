import * as ActionTypes from "@/constants/actionTypes";
import * as ReducerTypes from "@/constants/reducerTypes";
import * as route from "@/constants/routes";
/**
 * @file authenticationReducer.js
 * all data associated with a users record is handled within this reducer.
 */
const initialState = {
  isAuthenticated: undefined,
  userInfo: {},
  redirect: false,
  isProponent: undefined,
};

const getUserName = (tokenParsed) => {
  const { bceid_username } = tokenParsed;
  if (bceid_username && bceid_username.length > 0) {
    return `${bceid_username}@bceid`;
  }
  if (tokenParsed.idir_username) {
    return tokenParsed.idir_username;
  }
  return tokenParsed.preferred_username;
};

const authenticationReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.AUTHENTICATE_USER:
      const tokenParsed = action.payload.userInfo;
      const preferred_username = getUserName(tokenParsed);
      return {
        ...state,
        isAuthenticated: true,
        userInfo: {
          ...action.payload.userInfo,
          preferred_username,
        },
        redirect: route.MINES.route,
      };
    case ActionTypes.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        userInfo: {},
        redirect: route.HOME.route,
      };
    case ActionTypes.STORE_IS_PROPONENT:
      return {
        ...state,
        isProponent: action.payload.data,
      };
    default:
      return state;
  }
};

export const isAuthenticated = (state) => state[ReducerTypes.AUTHENTICATION].isAuthenticated;
export const getUserInfo = (state) => state[ReducerTypes.AUTHENTICATION].userInfo;
export const getRedirect = (state) => state[ReducerTypes.AUTHENTICATION].redirect;
export const isProponent = (state) => state[ReducerTypes.AUTHENTICATION].isProponent;

export default authenticationReducer;
