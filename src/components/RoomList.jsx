import React from "react";
import { connect } from "react-redux";
import { Box, Heading, Button } from "grommet";
import { FormNext, AddCircle } from "grommet-icons";
import { PuffLoader } from "react-spinners";
import * as actions from "../actions";
import theme from '../styles/theme';

class RoomList extends React.Component {
  componentDidMount = () => {
    if (!this.props.rooms) {
      this.props.dispatch(actions.fetchRooms());
    }
  };

  render = () => {
    return (
      <Box
        background="focusBackground"
        round
        pad={{ top: "none", horizontal: "none", bottom: "medium" }}
        justify="start"
        style={{ minHeight: "150px", minWidth: "450px" }}
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
          <Heading level="3" margin="none">
            Rooms
          </Heading>
          <Button icon={<AddCircle />} a11yTitle="Add a new room" onClick={()=>this.props.dispatch(actions.redirect("/create_room"))} />
        </Box>
        {this.props.loading ? (
          <Box flex align="center" justify="center" style={{minHeight: "50px"}}>
            <PuffLoader loading color={theme.global.colors.brand} />
          </Box>
        ) : !!this.props.rooms ? (
          this.props.rooms.map(room => <RoomEntry room={room} key={room.room_id} {...this.props}/>)
        ) : (
          <NoRooms />
        )}
      </Box>
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
    <h3>You haven't joined any rooms yet</h3>
  </Box>
);

const RoomEntry = ({ room, dispatch }) => (
  <Box
    flex
    direction="row"
    align="center"
    focusIndicator={false}
    pad={{ horizontal: "medium" }}
    onClick={() => dispatch(actions.redirect(`/room/${room.room_id}`))}
    hoverIndicator={{ color: "brand", opacity: "medium" }}
    justify="between"
    a11yTitle={`Link to the room with name "${room.room_name}"`}
  >
    <h3>{room.room_name}</h3>
    <FormNext />
  </Box>
);

function mapStateToProps(state) {
  return {
    token: state.jwt,
    loading: !!state.loadingRooms,
    rooms: state.rooms,
  };
}

export default connect(mapStateToProps)(RoomList);
