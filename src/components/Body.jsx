import React from 'react';
import { Box } from "grommet";
import { Router, Route } from "react-router-dom";
import RoomList from "./RoomList";
import Room from "./Room";

export default (props) => (
  <Box flex align="center" justify="center">
    <Router history={props.history}>
      <Route exact path="/" component={RoomList} />
      <Route exact path="/room/:roomId" component={Room} />
    </Router>
  </Box>
);
