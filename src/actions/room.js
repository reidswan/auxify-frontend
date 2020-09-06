import history from "../history";
import api from "./api";
import { asyncActionsCreator } from "./common";
import { requiresUserLogin } from "./auth";

export const FETCH_ROOMS = asyncActionsCreator("FETCH_ROOMS");
export const CREATE_ROOM = asyncActionsCreator("CREATE_ROOM");
export const FETCH_ROOM_BY_ID = asyncActionsCreator("FETCH_ROOM_BY_ID");
export const SEARCH = asyncActionsCreator("SEARCH");
// Can't use asyncActionsCreator since it requires special handling
export const ENQUEUE = {
  BEGIN: "ENQUEUE_BEGIN",
  begin: (roomId, uri) => {
    return {
      type: "ENQUEUE_BEGIN",
      roomId,
      uri,
    };
  },
  SUCCESS: "ENQUEUE_SUCCESS",
  success: (roomId, uri) => {
    return {
      type: "ENQUEUE_SUCCESS",
      roomId,
      uri,
    };
  },
  FAILURE: "ENQUEUE_FAILURE",
  failure: (roomId, uri) => {
    return {
      type: "ENQUEUE_FAILURE",
      roomId,
      uri,
    };
  },
  CLEAR: "ENQUEUE_CLEAR",
  clear: (roomId, uri) => {
    return {
      type: "ENQUEUE_CLEAR",
      roomId,
      uri,
    };
  },
};

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

function _search(roomId, query) {
  return (dispatch, getState) => {
    dispatch(SEARCH.begin());
    let token = getState().token;
    return api
      .get(`/rooms/${roomId}/search`, token, {
        params: { q: query },
      })
      .then((result) => {
        dispatch(SEARCH.success(result.data));
      })
      .catch((err) => dispatch(SEARCH.failure(err)));
  };
}

export const search = requiresUserLogin(_search);

function _enqueue(roomId, uri) {
  return (dispatch, getState) => {
    dispatch(ENQUEUE.begin(roomId, uri));
    let token = getState().token;
    return api
      .put(`/rooms/${roomId}/queue`, { uri }, token)
      .then((result) => {
        dispatch(ENQUEUE.success(roomId, uri));
      })
      .catch((err) => dispatch(ENQUEUE.failure(roomId, uri)));
  };
}

export const enqueue = requiresUserLogin(_enqueue);

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
      },
    };
  },
  [FETCH_ROOM_BY_ID.FAILURE]: (state, action) => {
    console.error(action.err);
    return {
      ...state,
      currentRoom: {
        loading: false,
        error: true,
        data: null,
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
      },
    };
  },
  [SEARCH.BEGIN]: (state, action) => {
    return {
      ...state,
      search: {
        loading: true,
        error: false,
        results: [],
      },
    };
  },
  [SEARCH.FAILURE]: (state, action) => {
    console.error(action.err);
    return {
      ...state,
      search: {
        loading: false,
        error: true,
        results: [],
      },
    };
  },
  [SEARCH.SUCCESS]: (state, action) => {
    return {
      ...state,
      search: {
        loading: false,
        error: false,
        results:
          !!action.data && !!action.data.results ? action.data.results : [],
      },
    };
  },
  [SEARCH.CLEAR]: (state, action) => {
    return {
      ...state,
      search: {
        loading: false,
        error: false,
        results: [],
      },
    };
  },
  /**
   * What is [ENQUEUE.*] doing?
   * Essentially, it tracks state in the following shape:
   * enqueue: {
   *  <roomId>: {
   *    <trackUri>: { loading, error }
   *  }
   * }
   * if enqueue.[roomId].[trackUri] is not present, this is assumed
   * to mean success to prevent accumulating too much state over time
   *
   * So what is happening is that, on begin, we ensure that
   * state.enqueue.[roomId] and ...[roomId].[uri] exist (with loading=true)
   * The ...(state.enqueue ? state.enqueue[roomId] : {}) will ensure that
   * an existing state.enqueue[roomId] is preserved (through cloning), not
   * overwritten
   *
   * on failure, we perform similar checks but with error=true
   *
   * on success, we first clone (or create) the enqueue[roomId],
   * then delete the [uri] property
   *
   * tests/room-handlers.test.js might provide more clarity? idk
   */
  [ENQUEUE.BEGIN]: (state, action) => {
    let roomId = action.roomId;
    let uri = action.uri;
    return {
      ...state,
      enqueue: {
        ...state.enqueue,
        [roomId]: {
          ...(state.enqueue ? state.enqueue[roomId] : {}),
          [uri]: {
            loading: true,
            error: false,
          },
        },
      },
    };
  },
  [ENQUEUE.FAILURE]: (state, action) => {
    let roomId = action.roomId;
    let uri = action.uri;
    return {
      ...state,
      enqueue: {
        ...state.enqueue,
        [roomId]: {
          ...(state.enqueue ? state.enqueue[roomId] : {}),
          [uri]: {
            loading: false,
            error: true,
          },
        },
      },
    };
  },
  [ENQUEUE.SUCCESS]: (state, action) => {
    let roomId = action.roomId;
    let uri = action.uri;
    let roomQueueClone = !!state.enqueue[roomId]
      ? { ...state.enqueue[roomId] }
      : {};
    delete roomQueueClone[uri];
    return {
      ...state,
      enqueue: {
        ...state.enqueue,
        [roomId]: {
          ...roomQueueClone,
        },
      },
    };
  },
};
