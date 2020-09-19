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
import { redirect } from "../actions";
import FlexibleContainer from "./FlexibleContainer";
import theme from "../styles/theme";
import { findRoom, FIND_ROOM } from "../actions";

class AddRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ownerId: "",
      roomId: "",
      dispatched: null,
    };
  }

  componentDidMount = () => {
    this.props.dispatch(FIND_ROOM.clear());
  };

  isNumber = (n) => {
    return (
      typeof n === "number" || (typeof n === "string" && !!n.match(/^\d+$/))
    );
  };

  validate = (formContents) => {
    if (!formContents) {
      return { disabled: true };
    }
    if (!this.isNumber(formContents)) {
      return {
        errorMessage: "Not a valid number",
        disabled: true,
      };
    }
    return {};
  };

  handleFormChange = (member, value) => {
    if (value === "" || this.isNumber(value)) {
      this.setState({
        [member]: value,
      });
    }
  };

  render = () => {
    let ownerIdProps = this.validate(this.state.ownerId);
    let roomIdProps = this.validate(this.state.roomId);
    if (this.state.dispatched === "owner_id") {
      ownerIdProps = {
        errorMessage: this.props.findRoom.notFound
          ? "Not found"
          : this.props.findRoom.error
          ? "Something went wrong; try again"
          : null,
        error: this.props.findRoom.error,
        loading: this.props.findRoom.loading,
        ...ownerIdProps,
      };
    } else {
      roomIdProps = {
        errorMessage: this.props.findRoom.notFound
          ? "Not found"
          : this.props.findRoom.error
          ? "Something went wrong; try again"
          : null,
        error: this.props.findRoom.error,
        loading: this.props.findRoom.loading,
        ...roomIdProps,
      };
    }

    return (
      <FlexibleContainer a11yTitle="Form for joining or creating a room">
        <Box
          flex
          direction="row"
          justify="between"
          align="center"
          pad={{
            left: "medium",
            right: "small",
            top: "medium",
          }}
        >
          <Heading level="2" margin="none">
            Join or create a room
          </Heading>
        </Box>
        <JoinByForm
          resource="owner ID"
          loading={false}
          dispatch={this.props.dispatch}
          onSubmit={(e) => {
            this.setState({ dispatched: "owner_id" });
            this.props.dispatch(findRoom(this.state.ownerId));
          }}
          value={this.state.ownerId}
          onChange={(e) => this.handleFormChange("ownerId", e.target.value)}
          {...ownerIdProps}
        />
        <JoinByForm
          resource="room ID"
          loading={false}
          onSubmit={(e) => {
            this.setState({ dispatched: "room_id" });
            this.props.dispatch(findRoom(undefined, this.state.roomId));
          }}
          value={this.state.roomId}
          onChange={(e) => this.handleFormChange("roomId", e.target.value)}
          {...roomIdProps}
        />
        <Box
          pad={{
            left: "medium",
            right: "small",
            bottom: "medium",
            top: "small",
          }}
          align="center"
          justify="center"
        >
          <Box pad={{ bottom: "medium" }}>
            <Text>OR</Text>
          </Box>
          <Button
            label="Create room"
            icon={<Next color="black" />}
            reverse
            primary
            color="brand"
            size="large"
            onClick={() => this.props.dispatch(redirect("/room/create"))}
          />
        </Box>
      </FlexibleContainer>
    );
  };
}

const JoinByForm = ({
  resource,
  loading,
  errorMessage,
  onSubmit,
  value,
  onChange,
  disabled,
}) => {
  let icon = loading ? (
    <Loader size="20px" color="black" />
  ) : (
    <Next color="black" />
  );
  let buttonDisabled = disabled || loading;
  return (
    <Box pad={{ vertical: "small", horizontal: "medium" }}>
      <Form onSubmit={(e) => onSubmit(e.value.resource_id)}>
        <Box direction="row">
          <Box fill>
            <FormField
              name="resource_id"
              htmlfor="resource_id_input"
              label={`Join by ${resource}`}
            >
              <TextInput
                id="resource_id_input"
                name="resource_id"
                required
                value={value}
                onChange={onChange}
              />
            </FormField>
          </Box>
          <Box
            align="end"
            justify="end"
            pad={{ left: "medium", bottom: "small" }}
          >
            <Button
              primary
              type="submit"
              icon={icon}
              size="large"
              color={theme.global.colors.brand}
              disabled={buttonDisabled}
            />
          </Box>
        </Box>
        {!!errorMessage && (
          <Text size="small" color="status-critical">
            {errorMessage}
          </Text>
        )}
      </Form>
    </Box>
  );
};

function mapStateToProps(state) {
  return {
    findRoom: state.findRoom,
  };
}

export default connect(mapStateToProps)(AddRoom);
