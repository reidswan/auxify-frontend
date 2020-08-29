import React from "react";
import { Box } from "grommet";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { isTokenExpired } from "../utils";
import RoomList from "./RoomList";
import Room from "./Room";
import CreateRoom from "./CreateRoom";
import Auth from "./Auth";
import { SpotifyCallback } from "./SpotifyAuth";

const PrivateRoute = (props) =>
  props.loggedIn ? <Route {...props} /> : <Redirect to="/login" />;

const Body = (props) => {
  let loggedIn = !!props.token && !isTokenExpired(props.token);

  return (
    <Box flex align="center" justify="start">
      <Router history={props.history}>
        <Switch>
          <Route exact path="/login" component={Auth} />
          <PrivateRoute
            exact
            path="/"
            component={RoomList}
            loggedIn={loggedIn}
          />
          <PrivateRoute
            exact
            path="/room/:roomId"
            component={Room}
            loggedIn={loggedIn}
          />
          <PrivateRoute
            exact
            path="/create_room"
            component={CreateRoom}
            loggedIn={loggedIn}
          />
          <PrivateRoute
            exact
            path="/callback"
            component={SpotifyCallback}
            loggedIn={loggedIn}
          />
        </Switch>
      </Router>
    </Box>
  );
};

function mapStateToProps(state) {
  return {
    token: state.token,
  };
}

export default connect(mapStateToProps)(Body);
