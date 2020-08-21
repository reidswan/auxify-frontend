import React from "react";
import { connect } from "react-redux";
import { Box, Heading, Form, FormField, Button, TextInput } from "grommet";
import { Next, Spotify } from "grommet-icons";
import Loader from "./Loader";
import { fetchRooms } from "../actions/actions";
import FlexibleContainer from "./FlexibleContainer";
import SpotifyAuth from "./SpotifyAuth";

class CreateRoom extends React.Component {
  componentDidMount = () => {
    if (!this.props.rooms) {
      this.props.dispatch(fetchRooms());
    }
  };

  render = () => {
    let authedWithSpotify =
      !!this.props.user && this.props.user.authed_with_spotify;

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
        {authedWithSpotify ? (
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

const CreateRoomForm = ({ loading, dispatch }) => {
  let icon = loading ? <Loader size="20px" color="black" /> : <Next />;
  return (
    <Box pad={{ vertical: "small", horizontal: "medium" }}>
      <Form
        onSubmit={({ value }) => {
          console.log(value);
        }}
      >
        <FormField name="room_name" htmlfor="room_name_input" label="Room name">
          <TextInput id="room_name_input" name="room_name" required />
        </FormField>
        <FormField name="room_code" htmlfor="room_code_input" label="Room code">
          <TextInput
            id="room_code_input"
            name="room_code"
            required={false}
            placeholder="Optional"
          />
        </FormField>
        <Box direction="row" justify="end" pad={{ top: "medium" }}>
          <Button primary type="submit" icon={icon} size="large" />
        </Box>
      </Form>
    </Box>
  );
};

function mapStateToProps(state) {
  return {
    token: state.jwt,
    loading: !!state.processingCreateRoom,
    rooms: state.rooms,
    user: state.user,
  };
}

export default connect(mapStateToProps)(CreateRoom);
