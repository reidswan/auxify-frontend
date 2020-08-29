import React from "react";
import { connect } from "react-redux";
import {
  Box,
  Heading,
  Form,
  FormField,
  Button,
  TextInput,
  Text,
} from "grommet";
import { Next } from "grommet-icons";
import Loader from "./Loader";
import { fetchUser, createRoom } from "../actions";
import FlexibleContainer from "./FlexibleContainer";
import SpotifyAuth from "./SpotifyAuth";
import theme from "../styles/theme";

class CreateRoom extends React.Component {
  componentDidMount = () => {
    if (!this.props.user) {
      this.props.dispatch(fetchUser());
    }
  };

  render = () => {
    let authedWithSpotify =
      !!this.props.user && this.props.user.authed_with_spotify;
    let loading = !!this.props.loadingUser;
    console.log(this.props);

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
            Create a room
          </Heading>
        </Box>
        {loading ? (
          <Box
            flex
            direction="column"
            justify="center"
            align="center"
            pad="small"
          >
            <Loader color={theme.global.colors.brand} size="35px" />
          </Box>
        ) : authedWithSpotify ? (
          <CreateRoomForm {...this.props} />
        ) : (
          <NotAuthorized />
        )}
      </FlexibleContainer>
    );
  };
}

const NotAuthorized = () => (
  <Box flex direction="column" justify="center" align="center" pad="small">
    <h3>To create a room, we need authorization to use your Spotify account</h3>
    <SpotifyAuth />
  </Box>
);

const CreateRoomForm = ({ loading, error, dispatch }) => {
  let icon = loading ? <Loader size="20px" color="black" /> : <Next />;
  return (
    <div>
      <Box
        pad={{ vertical: "small" }}
        background={{ color: theme.global.colors.brand, opacity: "medium" }}
      >
        <Text color="white" size="small" textAlign="center">
          This will deactivate any existing rooms you own.
        </Text>
      </Box>
      <Box pad={{ vertical: "small", horizontal: "medium" }}>
        <Form
          onSubmit={({ value }) => {
            dispatch(createRoom(value.room_name, value.room_code));
          }}
        >
          <FormField
            name="room_name"
            htmlfor="room_name_input"
            label="Room name"
          >
            <TextInput id="room_name_input" name="room_name" required />
          </FormField>
          <FormField
            name="room_code"
            htmlfor="room_code_input"
            label="Room code"
          >
            <TextInput
              id="room_code_input"
              name="room_code"
              required={false}
              placeholder="Optional"
            />
          </FormField>
          {!!error && (
            <Text size="small" color="status-critical">
              Failed to create the room; please try again in a few seconds.
            </Text>
          )}
          <Box direction="row" justify="end" pad={{ top: "medium" }}>
            <Button
              primary
              type="submit"
              icon={icon}
              size="large"
              color={theme.global.colors.brand}
              disabled={loading}
            />
          </Box>
        </Form>
      </Box>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    token: state.token,
    loading: !!state.processingCreateRoom,
    error: !!state.createRoomError,
    rooms: state.rooms,
    user: state.user,
    loadingUser: state.loadingUser,
  };
}

export default connect(mapStateToProps)(CreateRoom);
