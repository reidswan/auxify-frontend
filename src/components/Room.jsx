import React from "react";
import { connect } from "react-redux";
import { Box, Heading, TextInput, Text, Keyboard, Button } from "grommet";
import { Search, DocumentMissing, Next, Alert, Refresh } from "grommet-icons";
import theme from "../styles/theme.js";
import { fetchRoomById, redirect, search, SEARCH, enqueue } from "../actions";
import Loader from "./Loader";
import FlexibleContainer from "./FlexibleContainer";

// amount of time to wait in milliseconds before dispatching the search API call
const SEARCH_INPUT_DEBOUNCE_MS = 250;

class Room extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTimeout: null,
      searchString: "",
    };
  }

  componentDidMount = () => {
    this.loadInitialData();
  };

  loadInitialData = () => {
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

  render = () => {
    const loading = this.props.loading || !this.props.room;
    const { roomId } = this.props.match.params;
    const heading = loading ? `Room ${roomId}` : this.props.room.room_name;
    const searchLoading =
      !!this.state.searchTimeout || this.props.search.loading;
    const enqueue = this.props.enqueue[roomId] || {};
    return (
      <FlexibleContainer>
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
        </Box>
        <Box
          flex
          direction="column"
          align="center"
          pad={{ horizontal: "medium", top: "medium" }}
        >
          {this.props.error ? (
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
      </FlexibleContainer>
    );
  };
}

const SearchResults = ({ loading, results, error, ...props }) => {
  return (
    <Box flex={false} pad="medium" overflow="auto" align="center">
      {error ? (
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
  console.log(props.enqueue);
  const { roomId } = props.match.params;
  let loading = false;
  let error = false;
  if (!!props.enqueue && !!props.enqueue[props.uri]) {
    loading = !!props.enqueue[props.uri].loading;
    error = !!props.enqueue[props.uri].error;
  }

  let imgSrc = imageWithClosestWidth(props.images, 64).url;
  let artists = (props.artists || []).map((i) => i.name).join(", ");
  let imageAlt = `Cover image for ${props.name} by ${artists}`;

  let icon = error ? (
    <Refresh color="status-critical" size="20px" />
  ) : loading ? (
    <Loader size="20px" color={theme.global.colors.brand} />
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
        props.dispatch(enqueue(roomId, props.uri));
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
    search: state.search,
    enqueue: state.enqueue || {},
  };
}

export default connect(mapStateToProps)(Room);
