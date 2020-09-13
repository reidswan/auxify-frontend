import api from "./api";
import { isTokenExpired, storeToken } from "../utils";
import { asyncActionsCreator, redirect } from "./common";
import { clearToken } from "../utils";
import history from "../history";

export const FETCH_USER = asyncActionsCreator("FETCH_USER");
export const AUTH_WITH_SPOTIFY = asyncActionsCreator("AUTH_WITH_SPOTIFY");
export const SPOTIFY_CALLBACK = asyncActionsCreator("SPOTIFY_CALLBACK");
export const LOGIN = asyncActionsCreator("LOGIN");
export const REGISTER = asyncActionsCreator("REGISTER");

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
    let fn = (dispatch, getState) => {
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
    // deanonymize the function for testing purposes
    Object.defineProperty(fn, "name", {
      value: f.name.replace("_", ""),
      configurable: true,
    });
    return fn;
  };
}

function _fetchUser() {
  return (dispatch, getState) => {
    dispatch(FETCH_USER.begin());
    let token = getState().token;
    return api
      .get("/me", token)
      .then((result) => dispatch(FETCH_USER.success(result.data)))
      .catch((err) => dispatch(FETCH_USER.failure(err)));
  };
}

function _getSpotifyAuthURL() {
  return (dispatch, getState) => {
    dispatch(AUTH_WITH_SPOTIFY.begin());

    let token = getState().token;
    return api
      .get("/spotify_auth", token)
      .then((result) => {
        dispatch(AUTH_WITH_SPOTIFY.success(result.data));
        if (!!result.data && typeof result.data.url === "string") {
          document.location.href = result.data.url;
        }
      })
      .catch((err) => dispatch(AUTH_WITH_SPOTIFY.failure(err)));
  };
}

/**
 * send the callback data back to the server
 * @param {URLSearchParams} callbackParams the <?...> part of the spotify callback
 */
function _spotifyCallback(callbackParams) {
  return (dispatch, getState) => {
    dispatch(SPOTIFY_CALLBACK.begin());

    let token = getState().token;
    return api
      .get(`/callback?${callbackParams}`, token)
      .then((result) => {
        dispatch(SPOTIFY_CALLBACK.success(result.data));
      })
      .catch((err) => dispatch(SPOTIFY_CALLBACK.failure(err)));
  };
}

export function login(email, password) {
  return (dispatch, getState) => {
    dispatch(LOGIN.begin());

    return api
      .post("/login", { email, password })
      .then((result) => {
        storeToken(result.data.token);
        dispatch(LOGIN.success(result.data));
        history.push("/");
      })
      .catch((err) => dispatch(LOGIN.failure(err)));
  };
}

export function register(userData) {
  return (dispatch, getState) => {
    dispatch(REGISTER.begin());

    return api
      .post("/register", userData)
      .then((result) => {
        storeToken(result.data.token);
        dispatch(REGISTER.success(result.data));
        history.push("/");
      })
      .catch((err) => dispatch(REGISTER.failure(err)));
  };
}

export const fetchUser = requiresUserLogin(_fetchUser);
export const getSpotifyAuthURL = requiresUserLogin(_getSpotifyAuthURL);
export const spotifyCallback = requiresUserLogin(_spotifyCallback);

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
    type: LOGOUT,
  };
}

export const authHandlers = {
  [FETCH_USER.BEGIN]: (state, action) => {
    return {
      ...state,
      loadingUser: true,
    };
  },
  [FETCH_USER.SUCCESS]: (state, action) => {
    return {
      ...state,
      loadingUser: false,
      user: action.data,
    };
  },
  [FETCH_USER.FAILURE]: (state, action) => {
    console.error(action.err);
    return {
      ...state,
      loadingUser: false,
    };
  },
  [LOGIN.BEGIN]: (state, action) => {
    return {
      ...state,
      login: {
        loading: true,
        error: false,
      },
    };
  },
  [LOGIN.SUCCESS]: (state, action) => {
    return {
      ...state,
      login: { loading: false, error: false },
      token: action.data.token,
    };
  },
  [LOGIN.FAILURE]: (state, action) => {
    return {
      ...state,
      login: { loading: false, error: true },
    };
  },
  [AUTH_WITH_SPOTIFY.BEGIN]: (state, action) => {
    return {
      ...state,
      processingSpotifyAuth: true,
    };
  },
  [AUTH_WITH_SPOTIFY.SUCCESS]: (state, action) => {
    return {
      ...state,
      processingSpotifyAuth: false,
    };
  },
  [AUTH_WITH_SPOTIFY.FAILURE]: (state, action) => {
    return {
      ...state,
      processingSpotifyAuth: false,
    };
  },
  [SPOTIFY_CALLBACK.BEGIN]: (state, action) => {
    return {
      ...state,
      callback: {
        loading: true,
        success: false,
        error: false,
      },
    };
  },
  [SPOTIFY_CALLBACK.SUCCESS]: (state, action) => {
    return {
      ...state,
      callback: {
        loading: false,
        error: false,
        success: true,
      },
    };
  },
  [SPOTIFY_CALLBACK.FAILURE]: (state, action) => {
    return {
      ...state,
      callback: {
        loading: false,
        error: true,
        success: false,
      },
    };
  },
  [SPOTIFY_CALLBACK.CLEAR]: (state, action) => {
    // reset in case we need to re-attempt
    return {
      ...state,
      callback: {
        loading: false,
        error: false,
        success: false,
      },
    };
  },
  [REGISTER.BEGIN]: (state, action) => {
    return {
      ...state,
      register: {
        loading: true,
        error: null,
      },
    };
  },
  [REGISTER.SUCCESS]: (state, action) => {
    return {
      ...state,
      register: {
        loading: false,
        error: null,
      },
      token: action.data.token,
    };
  },
  [REGISTER.FAILURE]: (state, action) => {
    console.error(action.err);
    return {
      ...state,
      register: {
        loading: false,
        error: action.err,
      },
    };
  },
};
