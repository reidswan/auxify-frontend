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
      notFound: false,
    },
  };

  let nextState = reducer(startState, actions.SEARCH.begin());

  expect(nextState.search).toStrictEqual({
    loading: true,
    error: false,
    results: [],
    notFound: false,
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
    notFound: false,
  });

  nextState = reducer(nextState, actions.SEARCH.failure({ err: "failed" }));

  expect(nextState.search).toStrictEqual({
    loading: false,
    error: true,
    results: [],
    notFound: false,
  });

  nextState = reducer(
    nextState,
    actions.SEARCH.failure({ response: { status: 404 } })
  );

  expect(nextState.search).toStrictEqual({
    loading: false,
    error: false,
    results: [],
    notFound: true,
  });

  nextState = reducer(nextState, actions.SEARCH.clear());

  expect(nextState).toStrictEqual(startState);
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
        success: false,
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
        success: false,
      },
      trackURI2: {
        loading: true,
        error: false,
        success: false,
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
        success: false,
      },
      trackURI2: {
        loading: true,
        error: false,
        success: false,
      },
    },
    2: {
      trackURI2: {
        loading: true,
        error: false,
        success: false,
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
        success: false,
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
        success: false,
      },
      trackURI2: {
        loading: true,
        error: false,
        success: false,
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
        success: false,
      },
      trackURI2: {
        loading: true,
        error: false,
        success: false,
      },
    },
    2: {
      trackURI2: {
        loading: false,
        error: true,
        success: false,
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
  // should create the roomId if it does not exist
  let nextState = reducer(
    initialState,
    actions.ENQUEUE.success(roomId, "trackURI")
  );

  expect(nextState.shouldNotBeModified).toEqual(shouldNotBeModified);
  expect(nextState.enqueue).toStrictEqual({
    1: {
      trackURI: {
        loading: false,
        error: false,
        success: true,
      },
    },
  });

  // should add to, not overwrite, the existing room queue
  nextState = reducer(initialState, actions.ENQUEUE.begin(roomId, "trackURI2"));
  nextState = reducer(nextState, actions.ENQUEUE.success(roomId, "trackURI"));
  expect(nextState.enqueue).toStrictEqual({
    1: {
      trackURI: {
        loading: false,
        error: false,
        success: true,
      },
      trackURI2: {
        loading: true,
        error: false,
        success: false,
      },
    },
  });

  // should add an additional room, not modify or remove existing one
  let otherRoomId = 2;
  nextState = reducer(
    nextState,
    actions.ENQUEUE.success(otherRoomId, "trackURI2")
  );
  expect(nextState.enqueue).toStrictEqual({
    1: {
      trackURI: {
        loading: false,
        error: false,
        success: true,
      },
      trackURI2: {
        loading: true,
        error: false,
        success: false,
      },
    },
    2: {
      trackURI2: {
        loading: false,
        error: false,
        success: true,
      },
    },
  });
});

test("enqueue clear handler", () => {
  let initialState = {
    shouldNotBeModified,
    enqueue: {},
  };
  let roomId = 1;
  let secondRoomId = 2;
  // should be no issue if the room or track do not exist in state
  let nextState = reducer(
    initialState,
    actions.ENQUEUE.clear(roomId, "does not exist")
  );
  expect(nextState.enqueue).toStrictEqual({
    1: {},
  });

  nextState = reducer(initialState, actions.ENQUEUE.begin(roomId, "trackURI"));
  nextState = reducer(nextState, actions.ENQUEUE.clear(roomId, "trackURI"));

  expect(nextState.enqueue).toStrictEqual({
    1: {},
  });

  // success after failure
  nextState = reducer(
    initialState,
    actions.ENQUEUE.failure(roomId, "trackURI")
  );
  nextState = reducer(nextState, actions.ENQUEUE.clear(roomId, "trackURI"));

  expect(nextState.enqueue).toStrictEqual({
    1: {},
  });

  nextState = reducer(initialState, actions.ENQUEUE.begin(roomId, "trackURI"));
  nextState = reducer(nextState, actions.ENQUEUE.begin(roomId, "trackURI2"));
  nextState = reducer(nextState, actions.ENQUEUE.clear(roomId, "trackURI"));

  expect(nextState.enqueue).toStrictEqual({
    1: {
      trackURI2: {
        loading: true,
        error: false,
        success: false,
      },
    },
  });

  nextState = reducer(initialState, actions.ENQUEUE.begin(roomId, "trackURI"));
  nextState = reducer(nextState, actions.ENQUEUE.begin(roomId, "trackURI2"));
  nextState = reducer(
    nextState,
    actions.ENQUEUE.begin(secondRoomId, "trackURI")
  );
  nextState = reducer(nextState, actions.ENQUEUE.clear(roomId, "trackURI"));

  expect(nextState.enqueue).toStrictEqual({
    1: {
      trackURI2: {
        loading: true,
        error: false,
        success: false,
      },
    },
    2: {
      trackURI: {
        loading: true,
        error: false,
        success: false,
      },
    },
  });
});
