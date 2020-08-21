import * as actions from './actions';
import history from '../history'


const initialState = {
  "count": 0,
  "jwt": "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhdXRoIiwiZXhwIjoxNTk4MTA5MzI1LjQ5MTAyOSwibmJmIjoxNTk4MDIyOTI1LjQ5MTAyOSwic3ViIjoiMSJ9.hA884koiqx9Tcu7eiMSnwEv0xNIG384rgxYtIZh2qU0",
  "user": null, 
  "rooms": null,
  "loadingUser": false,
  "loadingRooms": false,
  "processingCreateRoom": false
}


export function reducer(state = initialState, action) {
  switch(action.type) {
    case actions.FETCH_USER.BEGIN:
      return {
        ...state,
        loadingUser: true
      }
    case actions.FETCH_USER.SUCCESS:
      return {
        ...state,
        loadingUser: false,
        user: action.data
      };
    case actions.FETCH_USER.FAILURE:
      console.log(action.err);
      return {
        ...state,
        loadingUser: false
      }
    case actions.FETCH_ROOMS.BEGIN:
      return {
        ...state,
        loadingRooms: true
      }
    case actions.FETCH_ROOMS.SUCCESS:
      return {
        ...state,
        loadingRooms: false,
        rooms: action.data.rooms
      };
    case actions.FETCH_ROOMS.FAILURE:
      console.log(action.err);
      return {
        ...state,
        loadingRooms: false
      }
    case actions.REDIRECT:
      history.push(action.location);
      return state;
    default:
      return state
  }
}