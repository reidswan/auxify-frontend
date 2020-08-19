import React from "react";
import { connect } from 'react-redux';
import * as actions from '../actions';

class RoomList extends React.Component {

  componentDidMount = () => {
    if (!this.props.rooms) {
      this.props.dispatch(actions.fetchRooms())
    }
  }

  render = () => {
    return (
      <div>
        <h1>Hello</h1>
        { this.props.loading ? <h2>Loading ...</h2> : 
          !!this.props.rooms ? this.props.rooms.map(
            room => <h2 key={room.room_id}>Room #{room.room_id} ({room.owner_id})</h2>
          ) : <NoRooms />}
      </div>
    );
  }
}

const NoRooms = () => {
  return <h1>no rooms</h1>
}

function mapStateToProps(state) {
  return {
    token: state.jwt,
    loading: !!state.loadingRooms,
    rooms: state.rooms
  };
}

export default connect(mapStateToProps)(RoomList);
