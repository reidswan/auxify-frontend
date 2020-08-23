import axios from "axios";
import { isTokenExpired, storeToken } from "../utils";
import { asyncActionsCreator, redirect } from "./common";
import { clearToken } from "../utils";
import history from "../history";

export const FETCH_USER = asyncActionsCreator("FETCH_USER");
export const AUTH_WITH_SPOTIFY = asyncActionsCreator("AUTH_WITH_SPOTIFY");
export const LOGIN = asyncActionsCreator("LOGIN");

/**
 * Wrapper around thunk action creators that will check for/require the presence of
 * the token and/or user object in state before processing the action
 * @param f {Function} the action creator to be wrapped
 * @param requireUser {boolean=false} whether the user object is required
 * @param requireToken {boolean=true} whether the jwt token is required
 * @return {undefined} - in particular, the return value of [f] is discarded
 */
export function requiresUserLogin(f, requireUser = false, requireToken = true) {
  return (...args) => {
    return (dispatch, getState) => {
      let state = getState();
      let hasValidToken = !!state.token && !isTokenExpired(state.token);
      if (requireToken && !hasValidToken) {
        dispatch(redirect("/login"));
      } else if (!state.user && requireUser) {
        dispatch(fetchUser());
      } else {
        f(...args)(dispatch, () => state);
      }
    };
  };
}

function _fetchUser() {
  return (dispatch, getState) => {
    dispatch(FETCH_USER.begin());
    let token = getState().token;
    return axios
      .get("http://localhost:8080/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => dispatch(FETCH_USER.success(result.data)))
      .catch((err) => dispatch(FETCH_USER.failure(err)));
  };
}

function _getSpotifyAuthURL() {
  return (dispatch, getState) => {
    dispatch(AUTH_WITH_SPOTIFY.begin());

    let token = getState().token;
    return axios
      .get("http://localhost:8080/spotify_auth", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => dispatch(AUTH_WITH_SPOTIFY.success(result.data)))
      .catch((err) => dispatch(AUTH_WITH_SPOTIFY.failure(err)));
  };
}

export function login(email, password) {
  return (dispatch, getState) => {
    dispatch(LOGIN.begin());

    return axios
      .post("http://localhost:8080/login", { email, password })
      .then((result) => {
        storeToken(result.data.token);
        history.push("/");
        dispatch(LOGIN.success(result.data))
      })
      .catch((err) => dispatch(LOGIN.failure(err)));
  };
}

export const fetchUser = requiresUserLogin(_fetchUser);
export const getSpotifyAuthURL = requiresUserLogin(_getSpotifyAuthURL);

export const SET_TOKEN = "SET_TOKEN";
export function setToken(token) {
  return {
    type: SET_TOKEN,
    token: token,
  };
}

export const LOGOUT = "LOGOUT";
export function logout() {
  clearToken();
  return {
    type: LOGOUT
  }
}
