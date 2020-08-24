import * as actions from ".";
import history from "../history";

const initialState = {
  count: 0,
  token: null,
  user: null,
  rooms: null,
  loadingUser: false,
  loadingRooms: false,
  fetchRoomsError: false,
  processingCreateRoom: false,
  processingLogin: false,
  loginError: false,
  processingSpotifyAuth: false,
  processingCallback: false,
  callbackError: false,
  callbackSuccess: false
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
        fetchRoomsError: false
      };
    case actions.FETCH_ROOMS.SUCCESS:
      return {
        ...state,
        loadingRooms: false,
        fetchRoomsError: false,
        rooms: action.data.rooms,
      };
    case actions.FETCH_ROOMS.FAILURE:
      console.log(action.err);
      return {
        ...state,
        loadingRooms: false,
        fetchRoomsError: true
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
    case actions.AUTH_WITH_SPOTIFY.BEGIN:
      return {
        ...state,
        processingSpotifyAuth: true
      }
    case actions.AUTH_WITH_SPOTIFY.SUCCESS:
      return {
        ...state,
        processingSpotifyAuth: false
      }
    case actions.AUTH_WITH_SPOTIFY.FAILURE:
      return {
        ...state,
        processingSpotifyAuth: false
      }
    case actions.SPOTIFY_CALLBACK.BEGIN:
      return {
        ...state,
        processingCallback: true,
        callbackSuccess: false,
        callbackError: false,
      }
    case actions.SPOTIFY_CALLBACK.SUCCESS:
      return {
        ...state,
        processingCallback: false,
        callbackError: false,
        callbackSuccess: true
      }
    case actions.SPOTIFY_CALLBACK.FAILURE:
      return {
        ...state,
        processingCallback: false,
        callbackError: true,
        callbackSuccess: false
      }
    case actions.SPOTIFY_CALLBACK.CLEAR:
      // reset in case we need to re-attempt
      return {
        ...state,
        processingCallback: false,
        callbackError: false,
        callbackSuccess: false
      }
    default:
      return state;
  }
}
