import { reducer } from "../../actions/reducer";
import * as actions from "../../actions";

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

test("login handler", () => {
  let initialState = { login: { loading: false, error: false } };

  let nextState = reducer(initialState, actions.LOGIN.begin());
  expect(nextState).toStrictEqual({
    login: {
      loading: true,
      error: false,
    },
  });

  nextState = reducer(nextState, actions.LOGIN.failure("oh no"));
  expect(nextState).toStrictEqual({
    login: {
      loading: false,
      error: true,
    },
  });

  let token = "this is my token";
  nextState = reducer(nextState, actions.LOGIN.success({ token }));
  expect(nextState).toStrictEqual({
    login: {
      loading: false,
      error: false,
    },
    token,
  });
});

test("register handler", () => {
  const shouldNotBeModified = "should not be modified";
  let initialState = {
    register: { loading: false, error: null },
    shouldNotBeModified,
  };

  let nextState = reducer(initialState, actions.REGISTER.begin());
  expect(nextState).toStrictEqual({
    register: {
      loading: true,
      error: null,
    },
    shouldNotBeModified,
  });

  const error = { response: "oh no" };
  nextState = reducer(nextState, actions.REGISTER.failure(error));
  expect(nextState).toStrictEqual({
    register: {
      loading: false,
      error,
    },
    shouldNotBeModified,
  });

  let token = "this is my token";
  nextState = reducer(nextState, actions.REGISTER.success({ token }));
  expect(nextState).toStrictEqual({
    register: {
      loading: false,
      error: null,
    },
    token,
    shouldNotBeModified,
  });
});
