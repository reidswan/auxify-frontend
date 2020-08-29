import history from "../history";
import api from "./api";
import { asyncActionsCreator } from "./common";
import { requiresUserLogin } from "./auth";

export const FETCH_ROOMS = asyncActionsCreator("FETCH_ROOMS");
export const CREATE_ROOM = asyncActionsCreator("CREATE_ROOM");

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

export const handlers = {
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
};
