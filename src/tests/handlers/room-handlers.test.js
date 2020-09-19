import { reducer } from "../../actions/reducer";
import * as actions from "../../actions";

const shouldNotBeModified = "shouldNotBeModified";

test("fetch room by ID handler", () => {
  let initialState = {
    shouldNotBeModified,
    currentRoom: {
      loading: false,
      error: false,
      data: null,
      notFound: false,
      forbidden: false,
    },
  };

  let nextState = reducer(initialState, actions.FETCH_ROOM_BY_ID.begin());

  expect(nextState.shouldNotBeModified).toBe(shouldNotBeModified);
  expect(nextState.currentRoom).toStrictEqual({
    loading: true,
    error: false,
    data: null,
    notFound: false,
    forbidden: false,
  });

  nextState = reducer(nextState, actions.FETCH_ROOM_BY_ID.failure(":("));
  expect(nextState.currentRoom).toStrictEqual({
    loading: false,
    error: true,
    data: null,
    notFound: false,
    forbidden: false,
  });

  let data = { roomId: 12, roomName: ":)" };
  nextState = reducer(nextState, actions.FETCH_ROOM_BY_ID.success(data));
  expect(nextState.currentRoom).toStrictEqual({
    loading: false,
    error: false,
    notFound: false,
    data,
    forbidden: false,
  });

  let error = { response: { status: 404 } };
  nextState = reducer(nextState, actions.FETCH_ROOM_BY_ID.failure(error));
  expect(nextState.currentRoom).toStrictEqual({
    loading: false,
    error: false,
    data: null,
    notFound: true,
    forbidden: false,
  });

  error = { response: { status: 403 } };
  nextState = reducer(nextState, actions.FETCH_ROOM_BY_ID.failure(error));
  expect(nextState.currentRoom).toStrictEqual({
    loading: false,
    error: false,
    data: null,
    notFound: false,
    forbidden: true,
  });
});
