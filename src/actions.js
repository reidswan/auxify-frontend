import axios from 'axios';

export const REDIRECT = "REDIRECT";

export function redirect(to) {
  console.log("REDIRECT:", to);
  return {
    "type": REDIRECT,
    "location": to
  }
}

function asyncActionsCreator(prefix) {
  let BEGIN = `${prefix}_BEGIN`;
  let SUCCESS = `${prefix}_SUCCESS`;
  let FAILURE =`${prefix}_FAILURE`;

  let begin = () => {
    return {
      "type": BEGIN
    }
  };

  let success = (data) => {
    return {
      "type": SUCCESS,
      "data": data
    }
  };

  let failure = (err) => {
    return {
      "type": FAILURE,
      "err": err
    }
  };

  return {
    BEGIN, SUCCESS, FAILURE, begin, success, failure
  }
}

export const FETCH_USER = asyncActionsCreator("FETCH_USER");
export const FETCH_ROOMS = asyncActionsCreator("FETCH_ROOMS");

function requiresUserLogin(f, requireUser = false, requireToken = true) {
  return (...args) => {
    return (dispatch, getState) => {
      let state = getState();
      if (!state.jwt && requireToken) {
        dispatch(redirect("/login"));
      } else if (!state.user && requireUser) {
        dispatch(fetchUser());
      } else {
        return f(...args)(dispatch, () => state);
      }
    }
  }
}

function _fetchUser() {
  return (dispatch, getState) => {
    dispatch(FETCH_USER.begin());
    let token = getState().jwt;
    return axios.get("http://localhost:8080/me", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then(result => dispatch(FETCH_USER.success(result.data)))
    .catch(err => dispatch(FETCH_USER.failure(err)));
  };
}

export const fetchUser = requiresUserLogin(_fetchUser);

function _fetchRooms() {
  return (dispatch, getState) => {
    dispatch(FETCH_ROOMS.begin());
    
    let token = getState().jwt;
    return axios.get("http://localhost:8080/rooms", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then(result => dispatch(FETCH_ROOMS.success(result.data)))
    .catch(err => dispatch(FETCH_ROOMS.failure(err)));
  }
}

export const fetchRooms = requiresUserLogin(_fetchRooms);
