import React from "react";
import Auth from "../../components/Auth";
import { render, screen } from "../test-utils";

test("Auth should show loading spinner when loading", () => {
  render(<Auth />, {
    initialState: { login: { loading: true, error: false } },
  });
  let icons = screen.getAllByRole("Loading");
  expect(icons.length).toBe(1);
});

test("Auth basic display test", () => {
  render(<Auth />, {
    initialState: { login: { loading: false, error: false } },
  });
  // Log in header + button
  expect(screen.getAllByText("Log in").length).toBe(2);
  // email field
  expect(screen.getAllByText("Email").length).toBe(1);
  expect(screen.getAllByText("Password").length).toBe(1);

  // Auth should show loading spinner when not loading
  let icons = screen.queryAllByRole("Loading");
  expect(icons.length).toBe(0);

  // no error message either
  expect(screen.queryAllByText(/Login failed/i).length).toBe(0);
});

test("Auth should show error message on error", () => {
  render(<Auth />, {
    initialState: { login: { loading: false, error: true } },
  });
  expect(screen.getAllByText(/Login failed/i).length).toBe(1);
});
