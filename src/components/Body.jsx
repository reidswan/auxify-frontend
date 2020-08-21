import React from 'react';
import { Box } from "grommet";
import { Router, Route } from "react-router-dom";
import RoomList from "./RoomList";
import Room from "./Room";
import CreateRoom from "./CreateRoom";

export default (props) => (
  <Box flex align="center" justify="start">
    <Router history={props.history}>
      <Route exact path="/" component={RoomList} />
      <Route exact path="/room/:roomId" component={Room} />
      <Route exact path="/create_room" component={CreateRoom} />
    </Router>
  </Box>
);
