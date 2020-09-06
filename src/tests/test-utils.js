import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import { reducer } from "../actions/reducer";

function render(
  ui,
  {
    initialState,
    store = createStore(reducer, initialState),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from "@testing-library/react";
// override render method
export { render };

export function testRedirectsTo(
  redirectTo,
  Component,
  initialState,
  initialPath = "/"
) {
  const history = createMemoryHistory([initialPath]);

  render(
    <Router history={history}>
      <Route path={initialPath} exact render={() => <Component />} />
      <Route path={redirectTo} exact render={() => <div>{redirectTo}</div>} />
    </Router>,
    { initialState }
  );

  expect(history.location.pathname).toEqual(redirectTo);
}

export const history = createMemoryHistory(["/"]);

export const TestingRouter = ({ Component, redirectUrl }) => (
  <Router history={history}>
    <Route path="/loc" exact={true} render={() => <Component />} />
    <Route
      path={redirectUrl}
      render={() => <div>redirected to {redirectUrl}</div>}
    />
  </Router>
);
