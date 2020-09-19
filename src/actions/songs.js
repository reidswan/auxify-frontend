import api from "./api";
import { asyncActionsCreator, isNotFoundError } from "./common";
import { requiresUserLogin } from "./auth";

export const SEARCH = asyncActionsCreator("SEARCH");
// Can't use asyncActionsCreator for ENQUEUE
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

function _enqueue(roomId, uri, clearAfter = null) {
  return (dispatch, getState) => {
    dispatch(ENQUEUE.begin(roomId, uri));
    let token = getState().token;
    return api
      .put(`/rooms/${roomId}/queue`, { uri }, token)
      .then((result) => {
        dispatch(ENQUEUE.success(roomId, uri));
        if (clearAfter !== null && clearAfter > 0) {
          setTimeout(() => dispatch(ENQUEUE.clear(roomId, uri)), clearAfter);
        }
      })
      .catch((err) => dispatch(ENQUEUE.failure(roomId, uri)));
  };
}

export const enqueue = requiresUserLogin(_enqueue);

export const songHandlers = {
  [SEARCH.BEGIN]: (state, action) => {
    return {
      ...state,
      search: {
        loading: true,
        error: false,
        results: [],
        notFound: false,
      },
    };
  },
  [SEARCH.FAILURE]: (state, action) => {
    console.error(action.err);
    let notFound = isNotFoundError(action.err);
    return {
      ...state,
      search: {
        loading: false,
        error: !notFound,
        results: [],
        notFound,
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
        notFound: false,
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
        notFound: false,
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
            success: false,
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
            success: false,
          },
        },
      },
    };
  },
  [ENQUEUE.SUCCESS]: (state, action) => {
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
            error: false,
            success: true,
          },
        },
      },
    };
  },
  [ENQUEUE.CLEAR]: (state, action) => {
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
