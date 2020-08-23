import axios from "axios";
import { asyncActionsCreator } from "./common";
import { requiresUserLogin } from "./auth";

export const FETCH_ROOMS = asyncActionsCreator("FETCH_ROOMS");

function _fetchRooms() {
  return (dispatch, getState) => {
    dispatch(FETCH_ROOMS.begin());

    let token = getState().token;
    return axios
      .get("http://localhost:8080/rooms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => dispatch(FETCH_ROOMS.success(result.data)))
      .catch((err) => dispatch(FETCH_ROOMS.failure(err)));
  };
}

export const fetchRooms = requiresUserLogin(_fetchRooms);
