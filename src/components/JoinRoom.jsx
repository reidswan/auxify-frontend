import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  Box,
  Heading,
  TextInput,
  FormField,
  Text,
  Button,
  Form,
} from "grommet";
import { Refresh, Next } from "grommet-icons";
import Loader from "./Loader";
import { fetchMinimalRoomById, JOIN_ROOM, joinRoom } from "../actions";
import FlexibleContainer from "./FlexibleContainer";
import theme from "../styles/theme";

class JoinRoom extends React.Component {
  componentDidMount = () => {
    this.props.dispatch(JOIN_ROOM.clear());
    this.loadInitialData();
  };

  loadInitialData = () => {
    const { roomId } = this.props.match.params;
    this.props.dispatch(fetchMinimalRoomById(roomId));
  };

  loadFailed = () => {
    return (
      <Box flex align="center" justify="between" style={{ minHeight: "80px" }}>
        <Text color="status-critical" size="large">
          Failed to load the room
        </Text>
        <Box pad="small">
          <Button
            primary
            color="status-critical"
            size="medium"
            icon={<Refresh />}
            label="Retry"
            onClick={this.loadInitialData}
          />
        </Box>
      </Box>
    );
  };

  render = () => {
    const { roomId } = this.props.match.params;
    let hasCode = true;

    if (!!this.props.data) {
      if (this.props.data.user_in_room) {
        console.log(this.props.data.user_in_room);
        // already a room member, so go to the room
        return <Redirect to={`/room/${roomId}`} />;
      }

      if (this.props.data.has_code !== undefined) {
        hasCode = this.props.data.has_code;
      }
    }

    let identifier =
      !!this.props.data && !!this.props.data.room_name
        ? this.props.data.room_name
        : `Room ${roomId}`;
    return (
      <FlexibleContainer a11yTitle="Form for creating a new room">
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
            Join {identifier}
          </Heading>
        </Box>
        {this.props.loading ? (
          <Box
            flex
            direction="column"
            justify="center"
            align="center"
            pad="small"
          >
            <Loader color={theme.global.colors.brand} size="35px" />
          </Box>
        ) : this.props.error ? (
          this.loadFailed()
        ) : hasCode ? (
          <JoinCodedRoom {...this.props} />
        ) : (
          <JoinCodelessRoom {...this.props} />
        )}
      </FlexibleContainer>
    );
  };
}

const JoinCodelessRoom = (props) => {
  const { roomId } = props.match.params;
  return props.joinRoom.loading ? (
    <Box flex direction="column" justify="center" align="center" pad="small">
      <Text size="large">Joining room</Text>
      <Box pad="small">
        <Loader color={theme.global.colors.brand} size="35px" />
      </Box>
    </Box>
  ) : props.joinRoom.error || !!props.joinRoom.failureMessage ? (
    <Box
      flex
      align="center"
      justify="between"
      style={{ minHeight: "80px" }}
      pad="small"
    >
      <Text color="status-critical" size="large">
        Failed to join the room
        {!!props.joinRoom.failureMessage &&
          ` - ${props.joinRoom.failureMessage}`}
      </Text>
      <Box pad="small">
        <Button
          primary
          color="status-critical"
          size="medium"
          icon={<Refresh />}
          label="Retry"
          onClick={() => props.dispatch(joinRoom(roomId))}
        />
      </Box>
    </Box>
  ) : props.joinRoom.success ? (
    <Redirect to={`/room/${roomId}`} />
  ) : (
    props.dispatch(joinRoom(roomId)) || ""
  );
};

const JoinCodedRoom = (props) => {
  const { roomId } = props.match.params;
  if (props.joinRoom.success) {
    return <Redirect to={`/room/${roomId}`} />;
  }

  const icon = props.joinRoom.loading ? (
    <Loader size="20px" color="black" />
  ) : (
    <Next />
  );
  return (
    <div>
      <Box pad={{ vertical: "small", horizontal: "medium" }}>
        <Form
          onSubmit={({ value }) => {
            props.dispatch(joinRoom(roomId, value.room_code));
          }}
        >
          <FormField
            name="room_code"
            htmlfor="room_code_input"
            label="Room code"
          >
            <TextInput id="room_code_input" name="room_code" required={false} />
          </FormField>
          {!!props.joinRoom.error && (
            <Text size="small" color="status-critical">
              Failed to join the room; please try again in a few seconds.
            </Text>
          )}
          {!!props.joinRoom.failureMessage && (
            <Text size="small" color="status-critical">
              {props.joinRoom.failureMessage}
            </Text>
          )}
          <Box direction="row" justify="end" pad={{ top: "medium" }}>
            <Button
              primary
              type="submit"
              icon={icon}
              size="large"
              color={theme.global.colors.brand}
              disabled={props.loading}
            />
          </Box>
        </Form>
      </Box>
    </div>
  );
};

function mapStateToProps(state) {
  console.log(state);
  return {
    ...state.minimalRoom,
    joinRoom: state.joinRoom,
  };
}

export default connect(mapStateToProps)(JoinRoom);
