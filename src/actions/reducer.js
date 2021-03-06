import * as actions from ".";
import history from "../history";
import { roomHandlers } from "./room";
import { authHandlers } from "./auth";
import { songHandlers } from "./songs";

const initialState = {
  count: 0,
  token: null,
  user: null,
  rooms: null,
  loadingUser: false,
  loadingRooms: false,
  fetchRoomsError: false,
  processingCreateRoom: false,
  createRoomError: false,
  login: {
    loading: false,
    error: false,
  },
  register: {
    loading: false,
    error: null,
  },
  processingSpotifyAuth: false,
  callback: {
    loading: false,
    error: false,
    success: false,
  },
  currentRoom: {
    loading: false,
    error: false,
    data: null,
    notFound: false,
    forbidden: false,
  },
  search: {
    loading: false,
    error: false,
    results: [],
    notFound: false,
  },
  enqueue: {},
  minimalRoom: {
    loading: false,
    error: false,
    notFound: false,
    data: null,
  },
  joinRoom: {
    loading: false,
    error: false,
    success: false,
    failureMessage: null,
  },
  deactivateRoom: {
    loading: false,
    error: false,
  },
  findRoom: {
    loading: false,
    error: false,
    notFound: false,
    roomId: null,
  },
};

function handlerBasedReducer(initialState, handlers) {
  return function (state = initialState, action) {
    const handler = handlers[action.type];
    if (!!handler) {
      return handler(state, action);
    } else {
      return switchReducer(state, action);
    }
  };
}

function switchReducer(state = initialState, action) {
  switch (action.type) {
    case actions.REDIRECT:
      history.push(action.location);
      return state;
    case actions.LOGOUT:
      return Object.assign({}, initialState);
    case actions.SET_TOKEN:
      return {
        ...state,
        token: action.token,
      };
    default:
      return state;
  }
}

const handlers = {
  ...roomHandlers,
  ...authHandlers,
  ...songHandlers,
};

export const reducer = handlerBasedReducer(initialState, handlers);
