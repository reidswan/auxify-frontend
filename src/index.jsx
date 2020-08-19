import React, { useState } from "react";
import { render } from "react-dom";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import {
  Grommet,
  Box,
  Button,
  Collapsible,
  ResponsiveContext,
  Layer,
} from "grommet";
import { FormClose } from "grommet-icons";

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
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <Provider store={store}>
      <Grommet theme={theme} full themeMode="dark">
        <ResponsiveContext.Consumer>
          {(size) => (
            <Box fill>
              <AppHeader />
              <Box flex direction="row" overflow={{ horizontal: "hidden" }}>
                {!showSidebar || size !== "small" ? (
                  <Collapsible direction="horizontal" open={showSidebar}>
                    <Box
                      flex
                      width="small"
                      background="light-2"
                      elevation="small"
                      align="center"
                      justify="start"
                      pad="small"
                      gap="large"
                    >
                      <div>thing 1</div>
                      <div>thing 1</div>
                      <div>thing 1</div>
                    </Box>
                  </Collapsible>
                ) : (
                  <Layer>
                    <Box
                      background="light-2"
                      tag="header"
                      justify="end"
                      align="center"
                      direction="row"
                    >
                      <Button
                        icon={<FormClose />}
                        onClick={() => setShowSidebar(false)}
                      />
                    </Box>
                    <Box
                      fill
                      background="light-2"
                      align="center"
                      justify="center"
                      pad="small"
                      gap="large"
                    >
                      <div>thing 1</div>
                      <div>thing 1</div>
                      <div>thing 1</div>
                    </Box>
                  </Layer>
                )}
                <Body history={history}/>
              </Box>
            </Box>
          )}
        </ResponsiveContext.Consumer>
      </Grommet>
    </Provider>
  );
};

render(<App store={store} />, document.getElementById("root"));
