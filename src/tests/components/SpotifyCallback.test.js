import React from "react";
import thunk from "redux-thunk";
import { MemoryRouter } from "react-router-dom";
import { SpotifyCallback } from "../../components/SpotifyAuth";
import { render, screen, testRedirectsTo } from "../test-utils";
import configureMockStore from "redux-mock-store";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test("SpotifyCallback should redirect when no search or no Spotify params", () => {
  let store = mockStore({
    callback: {
      loading: false,
      error: false,
      success: false,
    },
  });
  store.dispatch = console.log;

  testRedirectsTo(
    "/",
    () => <SpotifyCallback location={{}} />,
    { store },
    "/callback"
  );

  testRedirectsTo("/", () => <SpotifyCallback />, { store }, "/callback?q=abc");
});

test("SpotifyCallback displays error on error", () => {
  let store = mockStore({
    callback: {
      loading: false,
      error: false,
      success: false,
    },
  });
  store.dispatch = console.log;

  render(<SpotifyCallback location={{ search: "?error=yes" }} />, { store });

  expect(
    screen.getAllByText(/Failed to authorize with Spotify. Try again/i).length
  ).toBe(1);
  expect(
    screen.getAllByText(
      /Make sure you click the "Agree" button on the following screen/i
    ).length
  ).toBe(1);
});

test("SpotifyCallback sends callback to server", () => {
  let store = mockStore({
    callback: {
      loading: false,
      error: false,
      success: false,
    },
  });

  // capture dispatched actions
  let dispatched = [];
  store.dispatch = (action) => {
    dispatched.push(action);
  };

  render(
    <MemoryRouter>
      <SpotifyCallback location={{ search: "?code=123" }} />
    </MemoryRouter>,
    {
      store,
    }
  );

  expect(
    dispatched.some(
      (action) =>
        typeof action === "function" && action.name === "spotifyCallback"
    )
  ).toBe(true);
});

test("SpotifyCallback refreshes user on success", () => {
  let store = mockStore({
    callback: {
      loading: false,
      error: false,
      success: true,
    },
  });

  // capture dispatched actions
  let dispatched = [];
  store.dispatch = (action) => {
    dispatched.push(action);
  };

  render(
    <MemoryRouter>
      <SpotifyCallback location={{ search: "?code=123" }} />
    </MemoryRouter>,
    { store }
  );

  expect(
    dispatched.some(
      (action) => typeof action === "function" && action.name === "fetchUser"
    )
  ).toBe(true);
  expect(
    dispatched.some(
      (action) => "type" in action && action.type === "SPOTIFY_CALLBACK_CLEAR"
    )
  ).toBe(true);
});
