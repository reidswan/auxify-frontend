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
