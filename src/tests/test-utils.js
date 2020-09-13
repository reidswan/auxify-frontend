import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { Router, Route, MemoryRouter, Redirect } from "react-router-dom";
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
  renderOpts,
  initialPath = "/",
  initialPathPattern = undefined
) {
  const history = createMemoryHistory(); //{ initialEntries: [initialPath] });
  history.push(initialPath);
  initialPathPattern =
    initialPathPattern === undefined ? initialPath : initialPathPattern;
  let toRender = (
    <Router history={history}>
      <Route
        path={initialPathPattern}
        exact
        render={(props) => <Component {...props} />}
      />
      <Route path={redirectTo} exact render={() => <div>{redirectTo}</div>} />
    </Router>
  );
  render(toRender, renderOpts);
  expect(history.location.pathname).toEqual(redirectTo);
}

export const inRouter = (Component, mount, pattern) => (props) => {
  pattern = pattern === undefined ? mount : pattern;
  return (
    <MemoryRouter>
      {mount !== "/" && (
        <Route path="/" exact render={() => <Redirect to={mount} />} />
      )}
      <Route
        path={pattern}
        exact
        render={(routerProps) => <Component {...props} {...routerProps} />}
      />
    </MemoryRouter>
  );
};
