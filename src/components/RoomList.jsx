import React from "react";
import { connect } from "react-redux";
import { Box, Heading, Button, Text } from "grommet";
import { FormNext, AddCircle, FormRefresh } from "grommet-icons";
import Loader from "./Loader";
import * as actions from "../actions";
import theme from "../styles/theme";
import FlexibleContainer from "./FlexibleContainer";

class RoomList extends React.Component {
  componentDidMount = () => {
    if (!this.props.rooms) {
      this.props.dispatch(actions.fetchRooms());
    }
  };

  render = () => {
    return (
      <FlexibleContainer
        pad={{ top: "none", horizontal: "none", bottom: "medium" }}
        a11yTitle="List of rooms available to you"
      >
        <Box
          flex
          direction="row"
          justify="between"
          align="center"
          pad={{
            left: "medium",
            right: "small",
            top: "medium",
            bottom: "small",
          }}
        >
          <Heading level="2" margin="none">
            Rooms
          </Heading>
          <Button
            icon={<AddCircle />}
            a11yTitle="Add a new room"
            onClick={() => this.props.dispatch(actions.redirect("/room/add"))}
          />
        </Box>
        {this.props.loading ? (
          <Box
            flex
            align="center"
            justify="center"
            style={{ minHeight: "50px" }}
          >
            <Loader loading color={theme.global.colors.brand} size="40px" />
          </Box>
        ) : this.props.error ? (
          <Box
            flex
            pad={{ vertical: "xsmall" }}
            align="center"
            justify="between"
            style={{ minHeight: "100px" }}
          >
            <Text size="large" color="status-critical">
              Failed to load rooms.
            </Text>
            <Button
              primary
              color="status-critical"
              size="medium"
              icon={<FormRefresh />}
              label="Retry"
              onClick={() => this.props.dispatch(actions.fetchRooms())}
            />
          </Box>
        ) : !!this.props.rooms ? (
          this.props.rooms.map((room) => (
            <RoomEntry room={room} key={room.room_id} {...this.props} />
          ))
        ) : (
          <NoRooms />
        )}
      </FlexibleContainer>
    );
  };
}

const NoRooms = () => (
  <Box
    flex
    direction="row"
    align="center"
    focusIndicator={false}
    pad={{ horizontal: "medium" }}
    hoverIndicator={{ color: "brand", opacity: "medium" }}
    justify="center"
  >
    <h2>You haven't joined any rooms yet</h2>
  </Box>
);

const Badge = ({ children, ...props }) => (
  <h5 style={{ color: theme.global.colors.brand }} {...props}>
    {children}
  </h5>
);

const RoomEntry = ({ room, dispatch, user }) => (
  <Box
    flex
    direction="row"
    align="center"
    focusIndicator={false}
    pad={{ horizontal: "medium", vertical: "small" }}
    onClick={() => dispatch(actions.redirect(`/room/${room.room_id}`))}
    hoverIndicator={{ color: "brand", opacity: "medium" }}
    justify="between"
    a11yTitle={`Link to the room with name "${room.room_name}"`}
  >
    <Box flex direction="row" align="center" pad="none" justify="between">
      <h2>{room.room_name}</h2>
      {!!user && user.user_id === room.owner_id && <Badge>OWNED</Badge>}
    </Box>
    <FormNext />
  </Box>
);

function mapStateToProps(state) {
  return {
    token: state.token,
    loading: !!state.loadingRooms,
    error: !!state.fetchRoomsError,
    rooms: state.rooms,
    user: state.user,
  };
}

export default connect(mapStateToProps)(RoomList);
