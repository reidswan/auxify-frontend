import React from "react";
import { connect } from "react-redux";
import { Box, Heading, TextInput, Text, Keyboard, Button } from "grommet";
import {
  Search,
  DocumentMissing,
  Next,
  Alert,
  Refresh,
  Checkmark,
  FormClose,
} from "grommet-icons";
import theme from "../styles/theme.js";
import {
  fetchRoomById,
  redirect,
  search,
  SEARCH,
  enqueue,
  ENQUEUE,
  fetchUser,
  deactivateRoom,
  DEACTIVATE_ROOM,
} from "../actions";
import Loader from "./Loader";
import FlexibleContainer from "./FlexibleContainer";
import NotFound from "./NotFound";
import { Redirect } from "react-router-dom";

// amount of time to wait in milliseconds before dispatching the search API call
const SEARCH_INPUT_DEBOUNCE_MS = 250;
// amount of time to wait in milliseconds after success event to clear the result
const DISPATCH_CLEAR_ENQUEUE_WAIT_MS = 1500;

class Room extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTimeout: null,
      searchString: "",
      showingCode: false,
      dismissedRoomCodeBanner: false,
      deactivateShowing: false,
    };
  }

  componentDidMount = () => {
    this.loadInitialData();
  };

  loadInitialData = () => {
    if (!this.props.user) {
      this.props.dispatch(fetchUser());
    }
    const { roomId } = this.props.match.params;
    if (!roomId || isNaN(parseInt(roomId))) {
      this.props.dispatch(redirect("/"));
    } else {
      this.props.dispatch(fetchRoomById(roomId));
    }
  };

  handleSearchInput = (query) => {
    this.setState({ searchString: query }, () => this.loadSearchResults());
  };

  loadSearchResults = () => {
    if (!!this.state.searchTimeout) {
      clearTimeout(this.state.searchTimeout);
    }
    let query = this.state.searchString;
    if (!!query && !!query.trim()) {
      const { roomId } = this.props.match.params;
      let timeout = setTimeout(() => {
        this.props.dispatch(search(roomId, query));
        this.setState({ searchTimeout: null });
      }, SEARCH_INPUT_DEBOUNCE_MS);
      this.setState({ searchTimeout: timeout });
    } else {
      this.setState({ searchTimeout: null });
      this.props.dispatch(SEARCH.clear());
    }
  };

  loadFailed = () => {
    return (
      <Box flex align="center" justify="between" style={{ minHeight: "80px" }}>
        <Text color="status-critical" size="large">
          Failed to load the room
        </Text>
        <Button
          primary
          color="status-critical"
          size="medium"
          icon={<Refresh />}
          label="Retry"
          onClick={this.loadInitialData}
        />
      </Box>
    );
  };

  getRevealCodeText = () => {
    if (this.state.showingCode) {
      return this.props.room.room_code;
    }
    return "Tap to reveal room code";
  };

  render = () => {
    const loading = this.props.loading || !this.props.room;
    const { roomId } = this.props.match.params;
    const heading = loading ? `Room ${roomId}` : this.props.room.room_name;
    const searchLoading =
      !!this.state.searchTimeout || this.props.search.loading;
    const enqueue = this.props.enqueue[roomId] || {};
    const isOwner =
      loading || !this.props.user
        ? false
        : this.props.room.owner_id === this.props.user.user_id;
    const showBanner = isOwner && !this.state.dismissedRoomCodeBanner;

    return (
      <FlexibleContainer>
        {this.state.deactivateShowing ? (
          <Deactivate
            onConfirm={() => this.props.dispatch(deactivateRoom(roomId))}
            onCancel={() => {
              this.setState({ deactivateShowing: false });
              this.props.dispatch(DEACTIVATE_ROOM.clear());
            }}
            {...this.props}
          />
        ) : (
          <div>
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
                {heading}
              </Heading>
              {isOwner && (
                <Button
                  icon={<FormClose />}
                  a11yTitle="Deactivate this room"
                  onClick={() => this.setState({ deactivateShowing: true })}
                  focusIndicator={false}
                />
              )}
            </Box>
            {showBanner && (
              <Box
                direction="row"
                align="center"
                justify="between"
                background={{
                  color: theme.global.colors.brand,
                  opacity: "medium",
                }}
                focusIndicator={false}
                onClick={() =>
                  this.setState({ showingCode: !this.state.showingCode })
                }
              >
                <Box pad={{ horizontal: "medium" }}>
                  <Text color="white" size="small" textAlign="center">
                    {this.getRevealCodeText()}
                  </Text>
                </Box>
                <Box pad={{ horizontal: "small" }}>
                  <Button
                    icon={<FormClose color="white" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      this.setState({ dismissedRoomCodeBanner: true });
                    }}
                    hoverIndicator={false}
                  />
                </Box>
              </Box>
            )}
            <Box
              flex
              direction="column"
              align="center"
              pad={{ horizontal: "medium", top: "medium" }}
            >
              {this.props.notFound ? (
                <NotFound message="It looks like this room doesn't exist." />
              ) : this.props.forbidden ? (
                <Redirect to={`/room/${roomId}/join`} />
              ) : this.props.error ? (
                this.loadFailed()
              ) : loading ? (
                <Loader size="40px" color={theme.global.colors.brand} />
              ) : (
                <Keyboard onEnter={this.loadSearchResults}>
                  <TextInput
                    value={this.state.searchString}
                    icon={<Search />}
                    reverse
                    placeholder="Search for a track"
                    onChange={(e) => this.handleSearchInput(e.target.value)}
                  />
                </Keyboard>
              )}
            </Box>
            <SearchResults
              {...this.props}
              {...this.props.search}
              loading={searchLoading}
              enqueue={enqueue}
            />
          </div>
        )}
      </FlexibleContainer>
    );
  };
}

const Deactivate = (props) => {
  return (
    <div>
      <Box flex direction="row" align="center" pad="medium">
        <Heading level="2" margin="none">
          Deactivate this room?
        </Heading>
      </Box>
      <Box flex align="center" pad={{ horizontal: "medium" }}>
        <Text textAlign="center">
          This will prevent any new songs from being queued.
        </Text>
      </Box>
      <Box align="center" pad="medium" direction="row" justify="around">
        <Button
          size="large"
          primary
          label={<Text color="white">Confirm</Text>}
          color="red"
          focusIndicator={false}
          disabled={!!props.deactivateRoom.loading}
          icon={
            !!props.deactivateRoom.loading ? (
              <Loader color="white" size="20px" />
            ) : !!props.deactivateRoom.error ? (
              <Refresh color="white" />
            ) : null
          }
          onClick={props.onConfirm}
        />
        <Button
          size="large"
          secondary
          label={<Text color="white">Cancel</Text>}
          color="gray"
          focusIndicator={false}
          disabled={!!props.deactivateRoom.loading}
          onClick={props.onCancel}
        />
      </Box>
    </div>
  );
};

const SearchResults = ({ loading, results, error, notFound, ...props }) => {
  return (
    <Box flex={false} pad="medium" overflow="auto" align="center">
      {notFound ? (
        <Box flex align="center">
          <Text size="large">This room is no longer active</Text>
        </Box>
      ) : error ? (
        <Box flex align="center">
          <Alert color="status-critical" />
          <Text color="status-critical" size="large">
            Failed to load search results
          </Text>
        </Box>
      ) : loading ? (
        <Loader size="40px" color={theme.global.colors.brand} />
      ) : (
        results.map((res, i) => <SearchEntry key={i} {...props} {...res} />)
      )}
    </Box>
  );
};

const SearchEntry = (props) => {
  const { roomId } = props.match.params;
  let loading = false;
  let error = false;
  let success = false;
  if (!!props.enqueue && !!props.enqueue[props.uri]) {
    loading = !!props.enqueue[props.uri].loading;
    error = !!props.enqueue[props.uri].error;
    success = !!props.enqueue[props.uri].success;
  }

  let imgSrc = imageWithClosestWidth(props.images, 64).url;
  let artists = (props.artists || []).map((i) => i.name).join(", ");
  let imageAlt = `Cover image for ${props.name} by ${artists}`;

  let icon = error ? (
    <Refresh color="status-critical" size="20px" />
  ) : loading ? (
    <Loader size="20px" color={theme.global.colors.brand} />
  ) : success ? (
    <Checkmark size="20px" color="brand" />
  ) : (
    <Next size="20px" />
  );

  return (
    <Box
      flex
      direction="row"
      align="center"
      fill
      justify="start"
      onClick={(e) => {
        if (success) {
          props.dispatch(ENQUEUE.clear(roomId, props.uri));
        } else if (!loading) {
          props.dispatch(
            enqueue(roomId, props.uri, DISPATCH_CLEAR_ENQUEUE_WAIT_MS)
          );
        }
      }}
      hoverIndicator={{ color: theme.global.colors.brand, opacity: "medium" }}
      focusIndicator={false}
    >
      {!!imgSrc ? (
        <img src={imgSrc} height="64px" alt={imageAlt} />
      ) : (
        <DocumentMissing size="large" />
      )}
      <Box
        flex
        fill
        direction="column"
        align="start"
        justify="center"
        pad={{ horizontal: "small" }}
      >
        <Text size="small">{props.name}</Text>
        <Text size="xsmall">{artists}</Text>
      </Box>
      <Box pad={{ horizontal: "small" }}>{icon}</Box>
    </Box>
  );
};

function imageWithClosestWidth(images, width) {
  return (images || []).reduce((prev, curr) => {
    if (!prev) return curr;
    return Math.abs(prev.width - width) < Math.abs(curr.width - width)
      ? prev
      : curr;
  }, null);
}

function mapStateToProps(state) {
  return {
    loading: state.currentRoom.loading,
    error: state.currentRoom.error,
    room: state.currentRoom.data,
    notFound: state.currentRoom.notFound,
    forbidden: state.currentRoom.forbidden,
    search: state.search,
    enqueue: state.enqueue || {},
    user: state.user,
    deactivateRoom: state.deactivateRoom,
  };
}

export default connect(mapStateToProps)(Room);
