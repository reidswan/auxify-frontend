import React from "react";
import AppHeader from "../../components/AppHeader";
import { render, screen } from "../test-utils";
import * as utils from "../../utils";

/* Reset mocks */
let originalIsTokenExpired = utils.isTokenExpired;
afterEach(() => {
  utils.isTokenExpired = originalIsTokenExpired;
});

test("AppHeader should show a lock icon if user logged out", () => {
  render(<AppHeader />, { initialState: { token: null } });
  let icons = screen.getAllByLabelText("Lock");
  expect(icons.length).toBe(1);
});

test("AppHeader should show the user menu is user is logged in", () => {
  utils.isTokenExpired = jest.fn();
  utils.isTokenExpired.mockReturnValueOnce(false);
  render(<AppHeader />, { initialState: { token: "token" } });
  let icons = screen.getAllByLabelText("User");
  expect(icons.length).toBe(1);
});
