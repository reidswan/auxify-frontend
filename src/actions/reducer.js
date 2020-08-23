import * as actions from ".";
import history from "../history";

const initialState = {
  count: 0,
  token: null,
  user: null,
  rooms: null,
  loadingUser: false,
  loadingRooms: false,
  processingCreateRoom: false,
  processingLogin: false,
  loginError: false,
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_USER.BEGIN:
      return {
        ...state,
        loadingUser: true,
      };
    case actions.FETCH_USER.SUCCESS:
      return {
        ...state,
        loadingUser: false,
        user: action.data,
      };
    case actions.FETCH_USER.FAILURE:
      console.log(action.err);
      return {
        ...state,
        loadingUser: false,
      };
    case actions.FETCH_ROOMS.BEGIN:
      return {
        ...state,
        loadingRooms: true,
      };
    case actions.FETCH_ROOMS.SUCCESS:
      return {
        ...state,
        loadingRooms: false,
        rooms: action.data.rooms,
      };
    case actions.FETCH_ROOMS.FAILURE:
      console.log(action.err);
      return {
        ...state,
        loadingRooms: false,
      };
    case actions.REDIRECT:
      history.push(action.location);
      return state;
    case actions.LOGOUT:
      return Object.assign({}, initialState);
    case actions.LOGIN.BEGIN:
      return {
        ...state,
        processingLogin: true,
        loginError: false,
      };
    case actions.LOGIN.SUCCESS:
      return {
        ...state,
        processingLogin: false,
        loginError: false,
        token: action.data.token,
      };
    case actions.LOGIN.FAILURE:
      return {
        ...state,
        processingLogin: false,
        loginError: true,
      };
    case actions.SET_TOKEN:
      return {
        ...state,
        token: action.token,
      };
    default:
      return state;
  }
}
