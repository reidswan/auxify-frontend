import React from "react";
import thunk from "redux-thunk";
import { MemoryRouter } from "react-router-dom";
import JoinRoom from "../../components/JoinRoom";
import { render, screen, testRedirectsTo } from "../test-utils";
import configureMockStore from "redux-mock-store";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test("SpotifyCallback should redirect when no search or no Spotify params", () => {
  let initialState = {
    minimalRoom: {
      loading: false,
      error: false,
      notFound: false,
      data: {
        user_in_room: true,
      },
    },
    joinRoom: {
      loading: false,
      error: false,
      success: false,
      failureMessage: null,
    },
  };
  let store = mockStore(initialState);
  store.dispatch = console.log;

  testRedirectsTo(
    "/room/13",
    () => <JoinRoom match={{ params: { roomId: 13 } }} />,
    undefined,
    "/room/13/join"
  );

  // testRedirectsTo("/room/13", () => <SpotifyCallback />, { store }, "/callback?q=abc");
});
