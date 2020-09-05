import { reducer } from "../../actions/reducer";
import * as actions from "../../actions";

const shouldNotBeModified = "shouldNotBeModified";

test("search handler", () => {
  let startState = {
    shouldNotBeModified,
    search: {
      loading: false,
      error: false,
      results: [],
    },
  };

  let nextState = reducer(startState, actions.SEARCH.begin());

  expect(nextState.search).toStrictEqual({
    loading: true,
    error: false,
    results: [],
  });
  expect(nextState.shouldNotBeModified).toBe(shouldNotBeModified);

  let searchResults = ["1", "2", "3"];
  nextState = reducer(
    startState,
    actions.SEARCH.success({
      results: searchResults,
    })
  );

  expect(nextState.search).toStrictEqual({
    loading: false,
    error: false,
    results: searchResults,
  });

  nextState = reducer(nextState, actions.SEARCH.failure({ err: "failed" }));

  expect(nextState.search).toStrictEqual({
    loading: false,
    error: true,
    results: [],
  });

  nextState = reducer(nextState, actions.SEARCH.clear());

  expect(nextState).toStrictEqual(startState);
});

test("logout handler", () => {
  let initialState = reducer(undefined, { type: "test" });

  let modifiedState = {
    ...initialState,
    token: "something",
    user: { name: "john", surname: "smith", otherData: "some other stuff" },
    rooms: [1, 2, 3],
  };

  let nextState = reducer(modifiedState, actions.logout());

  expect(nextState).toStrictEqual(initialState);
});

test("enqueue begin handler", () => {
  let initialState = {
    shouldNotBeModified,
    enqueue: {},
  };
  let roomId = 1;
  // should create the roomId if it does not exist
  let nextState = reducer(
    initialState,
    actions.ENQUEUE.begin(roomId, "trackURI")
  );

  expect(nextState.shouldNotBeModified).toEqual(shouldNotBeModified);
  expect(nextState.enqueue).toStrictEqual({
    1: {
      trackURI: {
        loading: true,
        error: false,
      },
    },
  });

  // should add to, not overwrite, the existing room queue
  nextState = reducer(nextState, actions.ENQUEUE.begin(roomId, "trackURI2"));

  expect(nextState.enqueue).toStrictEqual({
    1: {
      trackURI: {
        loading: true,
        error: false,
      },
      trackURI2: {
        loading: true,
        error: false,
      },
    },
  });

  // should add an additional room, not modify or remove existing one
  let otherRoomId = 2;
  nextState = reducer(
    nextState,
    actions.ENQUEUE.begin(otherRoomId, "trackURI2")
  );

  expect(nextState.enqueue).toStrictEqual({
    1: {
      trackURI: {
        loading: true,
        error: false,
      },
      trackURI2: {
        loading: true,
        error: false,
      },
    },
    2: {
      trackURI2: {
        loading: true,
        error: false,
      },
    },
  });
});

test("enqueue failure handler", () => {
  let initialState = {
    shouldNotBeModified,
    enqueue: {},
  };
  let roomId = 1;
  // should create the roomId if it does not exist
  let nextState = reducer(
    initialState,
    actions.ENQUEUE.failure(roomId, "trackURI")
  );

  expect(nextState.shouldNotBeModified).toEqual(shouldNotBeModified);
  expect(nextState.enqueue).toStrictEqual({
    1: {
      trackURI: {
        loading: false,
        error: true,
      },
    },
  });

  // should add to, not overwrite, the existing room queue
  nextState = reducer(initialState, actions.ENQUEUE.begin(roomId, "trackURI2"));
  nextState = reducer(nextState, actions.ENQUEUE.failure(roomId, "trackURI"));
  expect(nextState.enqueue).toStrictEqual({
    1: {
      trackURI: {
        loading: false,
        error: true,
      },
      trackURI2: {
        loading: true,
        error: false,
      },
    },
  });

  // should add an additional room, not modify or remove existing one
  let otherRoomId = 2;
  nextState = reducer(
    nextState,
    actions.ENQUEUE.failure(otherRoomId, "trackURI2")
  );
  expect(nextState.enqueue).toStrictEqual({
    1: {
      trackURI: {
        loading: false,
        error: true,
      },
      trackURI2: {
        loading: true,
        error: false,
      },
    },
    2: {
      trackURI2: {
        loading: false,
        error: true,
      },
    },
  });
});

test("enqueue success handler", () => {
  let initialState = {
    shouldNotBeModified,
    enqueue: {},
  };
  let roomId = 1;
  let secondRoomId = 2;
  // should be no issue if the room or track do not exist in state
  let nextState = reducer(
    initialState,
    actions.ENQUEUE.success(roomId, "does not exist")
  );
  expect(nextState.enqueue).toStrictEqual({
    1: {},
  });

  nextState = reducer(initialState, actions.ENQUEUE.begin(roomId, "trackURI"));
  nextState = reducer(nextState, actions.ENQUEUE.success(roomId, "trackURI"));

  expect(nextState.enqueue).toStrictEqual({
    1: {},
  });

  // success after failure
  nextState = reducer(
    initialState,
    actions.ENQUEUE.failure(roomId, "trackURI")
  );
  nextState = reducer(nextState, actions.ENQUEUE.success(roomId, "trackURI"));

  expect(nextState.enqueue).toStrictEqual({
    1: {},
  });

  nextState = reducer(initialState, actions.ENQUEUE.begin(roomId, "trackURI"));
  nextState = reducer(nextState, actions.ENQUEUE.begin(roomId, "trackURI2"));
  nextState = reducer(nextState, actions.ENQUEUE.success(roomId, "trackURI"));

  expect(nextState.enqueue).toStrictEqual({
    1: {
      trackURI2: {
        loading: true,
        error: false,
      },
    },
  });

  nextState = reducer(initialState, actions.ENQUEUE.begin(roomId, "trackURI"));
  nextState = reducer(nextState, actions.ENQUEUE.begin(roomId, "trackURI2"));
  nextState = reducer(
    nextState,
    actions.ENQUEUE.begin(secondRoomId, "trackURI")
  );
  nextState = reducer(nextState, actions.ENQUEUE.success(roomId, "trackURI"));

  expect(nextState.enqueue).toStrictEqual({
    1: {
      trackURI2: {
        loading: true,
        error: false,
      },
    },
    2: {
      trackURI: {
        loading: true,
        error: false,
      },
    },
  });
});

test("fetch room by ID handler", () => {
  let initialState = {
    shouldNotBeModified,
    currentRoom: { loading: false, error: false, data: null },
  };

  let nextState = reducer(initialState, actions.FETCH_ROOM_BY_ID.begin());

  expect(nextState.shouldNotBeModified).toBe(shouldNotBeModified);
  expect(nextState.currentRoom).toStrictEqual({
    loading: true,
    error: false,
    data: null,
  });

  nextState = reducer(nextState, actions.FETCH_ROOM_BY_ID.failure(":("));
  expect(nextState.currentRoom).toStrictEqual({
    loading: false,
    error: true,
    data: null,
  });

  let data = { roomId: 12, roomName: ":)" };
  nextState = reducer(nextState, actions.FETCH_ROOM_BY_ID.success(data));
  expect(nextState.currentRoom).toStrictEqual({
    loading: false,
    error: false,
    data,
  });
});
