import React from "react";
import { render } from "react-dom";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import {
  Grommet,
  Box
} from "grommet";

import theme from './styles/theme'
import "./styles/index.css";
import * as actions from "./actions";
import { loadToken } from "./utils";
import { reducer } from "./actions/reducer";
import AppHeader from './components/AppHeader';
import Body from './components/Body';
import history from './history';

const store = createStore(reducer, applyMiddleware(thunk));

let token = loadToken();
if (!!token) {
  store.dispatch(actions.setToken(token));
  store.dispatch(actions.fetchUser());
}

const App = ({ store }) => {
  return (
    <Provider store={store}>
      <Grommet theme={theme} full themeMode="dark">
          <Box fill>
            <AppHeader />
            <Body history={history}/>
          </Box>
      </Grommet>
    </Provider>
  );
};

render(<App store={store} />, document.getElementById("root"));
