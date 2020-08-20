import React from "react";
import { render } from "react-dom";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import {
  Grommet,
  Box,
  ResponsiveContext,
} from "grommet";

import theme from './styles/theme'
import "./styles/index.css";
import * as actions from "./actions";
import { reducer } from "./reducer";
import AppHeader from './components/AppHeader';
import Body from './components/Body';
import history from './history';

const store = createStore(reducer, applyMiddleware(thunk));
store.dispatch(actions.fetchUser()); // TODO: cookies + login/register form


const App = ({ store }) => {
  return (
    <Provider store={store}>
      <Grommet theme={theme} full themeMode="dark">
        <ResponsiveContext.Consumer>
          {(size) => (
            <Box fill>
              <AppHeader />
              <Body history={history}/>
            </Box>
          )}
        </ResponsiveContext.Consumer>
      </Grommet>
    </Provider>
  );
};

render(<App store={store} />, document.getElementById("root"));
