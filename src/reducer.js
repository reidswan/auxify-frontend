import * as actions from './actions';
import history from './history'


const initialState = {
  "count": 0,
  "jwt": "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhdXRoIiwiZXhwIjoxNTk3NzY1MTMzLjc0MzMyNywibmJmIjoxNTk3Njc4NzMzLjc0MzMyNywic3ViIjoiMSJ9.3zZk8tVk5HO-f0tAMHTG7-f7XKL8bsy_TZSbv4oCnBE",
  "user": null, 
  "rooms": null,
  "loadingUser": false,
  "loadingRooms": false
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
      console.log("REDIRECTING!");
      console.log(action.location);
      history.push(action.location);
      return state;
    default:
      return state
  }
}