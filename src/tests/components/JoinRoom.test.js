import React from "react";
import thunk from "redux-thunk";
import JoinRoom from "../../components/JoinRoom";
import { render, screen, testRedirectsTo, inRouter } from "../test-utils";
import configureMockStore from "redux-mock-store";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const JoinRoomRouter = inRouter(JoinRoom, "/room/13", "/room/:roomId");

test("JoinRoom should redirect when the user is already a member", () => {
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
  store.dispatch = () => {};

  testRedirectsTo(
    "/room/13",
    () => <JoinRoom match={{ params: { roomId: 13 } }} />,
    { store, ...initialState },
    "/room/13/join"
  );
});

test("JoinRoom should show a failure message when failing to load the room", () => {
  let initialState = {
    minimalRoom: {
      loading: false,
      error: true,
      notFound: false,
      data: {
        user_in_room: false,
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
  store.dispatch = () => {};

  render(<JoinRoomRouter />, { store });
  expect(screen.getAllByText(/Failed to load the room/i).length).toBe(1);
});

test("JoinRoom should show a failure message when failing to load the room", () => {
  let initialState = {
    minimalRoom: {
      loading: false,
      error: false,
      notFound: true,
      data: {
        user_in_room: false,
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
  store.dispatch = () => {};

  render(<JoinRoomRouter />, { store });
  expect(screen.getAllByText(/couldn't find the room/i).length).toBe(1);
});

test("JoinRoom should display the room name", () => {
  let roomName = "Test room name";
  let initialState = {
    minimalRoom: {
      loading: false,
      error: false,
      notFound: false,
      data: {
        user_in_room: false,
        has_code: true,
        room_name: roomName,
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
  store.dispatch = () => {};

  render(<JoinRoomRouter />, { store });
  expect(screen.getAllByText(new RegExp(roomName, "i")).length).toBe(1);
});

test("JoinRoom should display the room name", () => {
  let roomName = "Test room name";
  let initialState = {
    minimalRoom: {
      loading: false,
      error: false,
      notFound: false,
      data: {
        user_in_room: false,
        has_code: true,
        room_name: roomName,
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
  store.dispatch = () => {};

  render(<JoinRoomRouter />, { store });
  expect(screen.getAllByText(new RegExp(roomName, "i")).length).toBe(1);
});

test("JoinRoom should display the room name", () => {
  let roomName = "Test room name";
  let initialState = {
    minimalRoom: {
      loading: false,
      error: false,
      notFound: false,
      data: {
        user_in_room: false,
        has_code: true,
        room_name: roomName,
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
  store.dispatch = () => {};

  render(<JoinRoomRouter />, { store });
  expect(screen.getAllByText(new RegExp(roomName, "i")).length).toBe(1);
});

test("JoinRoom for a coded room should request the code", () => {
  let roomName = "Test room name";
  let initialState = {
    minimalRoom: {
      loading: false,
      error: false,
      notFound: false,
      data: {
        user_in_room: false,
        has_code: true,
        room_name: roomName,
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
  store.dispatch = () => {};

  render(<JoinRoomRouter />, { store });
  expect(screen.getAllByText(/Room code/).length).toBe(1);
});

test("JoinRoom for a non-coded room should immediately request to join", () => {
  let roomName = "Test room name";
  let initialState = {
    minimalRoom: {
      loading: false,
      error: false,
      notFound: false,
      data: {
        user_in_room: false,
        has_code: false,
        room_name: roomName,
      },
    },
    joinRoom: {
      loading: false,
      error: false,
      success: false,
      failureMessage: null,
    },
  };
  let events = [];
  let store = mockStore(initialState);
  store.dispatch = (a) => {
    events.push(a);
  };

  render(<JoinRoomRouter />, { store });
  expect(events.length).toBeGreaterThan(0);
  expect(
    events.some((i) => typeof i === "function" && i.name === "joinRoom")
  ).toBe(true);
});
