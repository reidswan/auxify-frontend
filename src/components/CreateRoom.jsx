import React from "react";
import { connect } from 'react-redux';
import { fetchRooms } from '../actions';

class CreateRoom extends React.Component {

  componentDidMount = () => {
    if (!this.props.rooms) {
      this.props.dispatch(fetchRooms())
    }
  }

  render = () => {
    return (
      <div>
        <h1>You are creating a room</h1>
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

export default connect(mapStateToProps)(CreateRoom);
