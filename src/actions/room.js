import history from "../history";
import api from "./api";
import {
  asyncActionsCreator,
  isNotFoundError,
  isForbiddenError,
} from "./common";
import { requiresUserLogin } from "./auth";

export const FETCH_ROOMS = asyncActionsCreator("FETCH_ROOMS");
export const CREATE_ROOM = asyncActionsCreator("CREATE_ROOM");
export const FETCH_ROOM_BY_ID = asyncActionsCreator("FETCH_ROOM_BY_ID");
export const FETCH_MINIMAL_ROOM_BY_ID = asyncActionsCreator(
  "FETCH_MINIMAL_ROOM_BY_ID"
);
export const JOIN_ROOM = asyncActionsCreator("JOIN_ROOM");
export const DEACTIVATE_ROOM = asyncActionsCreator("DEACTIVATE_ROOM");
export const FIND_ROOM = asyncActionsCreator("FIND_ROOM");

function _fetchRooms() {
  return (dispatch, getState) => {
    dispatch(FETCH_ROOMS.begin());

    let token = getState().token;
    return api
      .get("/rooms", token)
      .then((result) => dispatch(FETCH_ROOMS.success(result.data)))
      .catch((err) => dispatch(FETCH_ROOMS.failure(err)));
  };
}

export const fetchRooms = requiresUserLogin(_fetchRooms);

function _createRoom(roomName, roomCode) {
  return (dispatch, getState) => {
    dispatch(CREATE_ROOM.begin());

    let token = getState().token;
    return api
      .post("/rooms", { room_code: roomCode, room_name: roomName }, token)
      .then((result) => {
        if (!!result.data.room_id) {
          history.push(`/room/${result.data.room_id}`);
        }
        dispatch(CREATE_ROOM.success(result.data));
        dispatch(fetchRooms());
      })
      .catch((err) => dispatch(CREATE_ROOM.failure(err)));
  };
}

export const createRoom = requiresUserLogin(_createRoom);

function _fetchRoomById(roomId) {
  return (dispatch, getState) => {
    dispatch(FETCH_ROOM_BY_ID.begin());

    let token = getState().token;
    return api
      .get(`/rooms/${roomId}`, token)
      .then((result) => {
        dispatch(FETCH_ROOM_BY_ID.success(result.data));
      })
      .catch((err) => {
        dispatch(FETCH_ROOM_BY_ID.failure(err));
      });
  };
}

export const fetchRoomById = requiresUserLogin(_fetchRoomById);

function _fetchMinimalRoomById(roomId) {
  return (dispatch, getState) => {
    dispatch(FETCH_MINIMAL_ROOM_BY_ID.begin());

    let token = getState().token;
    return api
      .get(`/rooms/${roomId}/minimal`, token)
      .then((result) => dispatch(FETCH_MINIMAL_ROOM_BY_ID.success(result.data)))
      .catch((err) => dispatch(FETCH_MINIMAL_ROOM_BY_ID.failure(err)));
  };
}

export const fetchMinimalRoomById = requiresUserLogin(_fetchMinimalRoomById);

function _joinRoom(roomId, roomCode = "") {
  return (dispatch, getState) => {
    dispatch(JOIN_ROOM.begin());
    let token = getState().token;
    return api
      .put(`/rooms/${roomId}/join`, { room_code: roomCode }, token)
      .then((result) => {
        dispatch(JOIN_ROOM.success(result.data));
      })
      .catch((err) => dispatch(JOIN_ROOM.failure(err)));
  };
}

export const joinRoom = requiresUserLogin(_joinRoom);

function _deactivateRoom(roomId) {
  return (dispatch, getState) => {
    dispatch(DEACTIVATE_ROOM.begin());
    let token = getState().token;
    return api
      .post(`/rooms/${roomId}/deactivate`, {}, token)
      .then((result) => {
        dispatch(DEACTIVATE_ROOM.success(result.data));
        dispatch(fetchRooms());
        history.push("/");
      })
      .catch((err) => dispatch(DEACTIVATE_ROOM.failure(err)));
  };
}

export const deactivateRoom = requiresUserLogin(_deactivateRoom);

function _findRoom(ownerId, roomId) {
  return (dispatch, getState) => {
    dispatch(FIND_ROOM.begin());
    let token = getState().token;
    let params = {};
    if (!!ownerId) {
      params["owner_id"] = ownerId;
    }
    if (!!roomId) {
      params["room_id"] = roomId;
    }
    return api
      .get(`/rooms/find`, token, { params })
      .then((result) => {
        dispatch(FIND_ROOM.success(result.data));
        history.push(`/room/${result.data.room_id}/join`);
      })
      .catch((err) => dispatch(FIND_ROOM.failure(err)));
  };
}

export const findRoom = requiresUserLogin(_findRoom);

export const roomHandlers = {
  [FETCH_ROOMS.BEGIN]: (state, action) => {
    return {
      ...state,
      loadingRooms: true,
      fetchRoomsError: false,
    };
  },
  [FETCH_ROOMS.SUCCESS]: (state, action) => {
    return {
      ...state,
      loadingRooms: false,
      fetchRoomsError: false,
      rooms: action.data.rooms,
    };
  },
  [FETCH_ROOMS.FAILURE]: (state, action) => {
    console.error(action.err);
    return {
      ...state,
      loadingRooms: false,
      fetchRoomsError: true,
    };
  },
  [CREATE_ROOM.BEGIN]: (state, action) => {
    return {
      ...state,
      processingCreateRoom: true,
      createRoomError: false,
    };
  },
  [CREATE_ROOM.FAILURE]: (state, action) => {
    console.error(action.err);
    return {
      ...state,
      processingCreateRoom: false,
      createRoomError: true,
    };
  },
  [CREATE_ROOM.SUCCESS]: (state, action) => {
    return {
      ...state,
      processingCreateRoom: false,
      createRoomError: false,
    };
  },
  [FETCH_ROOM_BY_ID.BEGIN]: (state, action) => {
    return {
      ...state,
      currentRoom: {
        loading: true,
        error: false,
        data: null,
        notFound: false,
        forbidden: false,
      },
    };
  },
  [FETCH_ROOM_BY_ID.FAILURE]: (state, action) => {
    console.error(action.err);
    let notFound = isNotFoundError(action.err);
    let forbidden = isForbiddenError(action.err);
    return {
      ...state,
      currentRoom: {
        loading: false,
        error: !notFound && !forbidden,
        data: null,
        notFound,
        forbidden,
      },
    };
  },
  [FETCH_ROOM_BY_ID.SUCCESS]: (state, action) => {
    return {
      ...state,
      currentRoom: {
        loading: false,
        error: false,
        data: action.data,
        notFound: false,
        forbidden: false,
      },
    };
  },
  [FETCH_MINIMAL_ROOM_BY_ID.BEGIN]: (state, action) => {
    return {
      ...state,
      minimalRoom: {
        loading: true,
        error: false,
        notFound: false,
        data: null,
      },
    };
  },
  [FETCH_MINIMAL_ROOM_BY_ID.SUCCESS]: (state, action) => {
    return {
      ...state,
      minimalRoom: {
        loading: false,
        error: false,
        notFound: false,
        data: action.data,
      },
    };
  },
  [FETCH_MINIMAL_ROOM_BY_ID.FAILURE]: (state, action) => {
    console.error(action.err);
    let notFound = isNotFoundError(action.err);
    return {
      ...state,
      minimalRoom: {
        loading: false,
        error: !notFound,
        data: null,
        notFound,
      },
    };
  },
  [JOIN_ROOM.BEGIN]: (state, action) => {
    return {
      ...state,
      joinRoom: {
        loading: true,
        error: false,
        success: false,
        failureMessage: null,
      },
    };
  },
  [JOIN_ROOM.FAILURE]: (state, action) => {
    console.error(action.err);
    return {
      ...state,
      joinRoom: {
        loading: false,
        error: true,
        success: false,
        failureMessage: null,
      },
    };
  },
  [JOIN_ROOM.CLEAR]: (state, action) => {
    return {
      ...state,
      joinRoom: {
        loading: false,
        error: false,
        success: false,
        failureMessage: null,
      },
    };
  },
  [JOIN_ROOM.SUCCESS]: (state, action) => {
    let success = !!action.data.success;
    let failureMessage = success ? null : action.data.message;
    return {
      ...state,
      joinRoom: {
        loading: false,
        error: false,
        success,
        failureMessage,
      },
    };
  },
  [DEACTIVATE_ROOM.BEGIN]: (state, action) => {
    return {
      ...state,
      deactivateRoom: {
        loading: true,
        error: false,
      },
    };
  },
  [DEACTIVATE_ROOM.SUCCESS]: (state, action) => {
    return {
      ...state,
      deactivateRoom: {
        loading: false,
        error: false,
      },
    };
  },
  [DEACTIVATE_ROOM.CLEAR]: (state, action) => {
    return {
      ...state,
      deactivateRoom: {
        loading: false,
        error: false,
      },
    };
  },
  [DEACTIVATE_ROOM.FAILURE]: (state, action) => {
    console.error(action.err);
    return {
      ...state,
      deactivateRoom: {
        loading: false,
        error: true,
      },
    };
  },
  [FIND_ROOM.CLEAR]: (state, action) => {
    return {
      ...state,
      findRoom: {
        loading: false,
        error: false,
        notFound: false,
      },
    };
  },
  [FIND_ROOM.BEGIN]: (state, action) => {
    return {
      ...state,
      findRoom: {
        loading: true,
        error: false,
        notFound: false,
      },
    };
  },
  [FIND_ROOM.FAILURE]: (state, action) => {
    console.error(action.err);
    let notFound = isNotFoundError(action.err);
    return {
      ...state,
      findRoom: {
        loading: false,
        error: !notFound,
        notFound,
      },
    };
  },
  [FIND_ROOM.SUCCESS]: (state, action) => {
    return {
      ...state,
      findRoom: {
        loading: false,
        error: false,
        notFound: false,
      },
    };
  },
};
