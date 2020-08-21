import React from "react";
import { connect } from 'react-redux';
import { fetchRooms } from '../actions/actions';

class Room extends React.Component {

  componentDidMount = () => {
    if (!this.props.rooms) {
      this.props.dispatch(fetchRooms())
    }
  }

  render = () => {
    const { roomId } = this.props.match.params;
    return (
      <div>
        <h1>You are in a room</h1>
        <h2>{!!roomId ? `Room #${roomId}` : "No room id"}</h2>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    token: state.jwt,
    loading: !!state.loadingRooms,
    rooms: state.rooms
  };
}

export default connect(mapStateToProps)(Room);
