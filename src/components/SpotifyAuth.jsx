import React from "react";
import { Button, Box, Heading, Text } from "grommet";
import { Spotify } from "grommet-icons";
import theme from "../styles/theme";
import Loader from "./Loader";
import { connect } from "react-redux";
import {
  getSpotifyAuthURL,
  spotifyCallback,
  SPOTIFY_CALLBACK,
  fetchUser
} from "../actions";
import FlexibleContainer from "./FlexibleContainer";
import { Redirect } from "react-router-dom";

const SpotifyAuthButton = (props) => (
  <Box flex direction="row" justify="center" pad="small">
    <Button
      disabled={props.loading}
      size="large"
      icon={
        props.loading ? (
          <Loader color={theme.global.colors.brand} size="20px" />
        ) : (
          <Spotify color="brand" />
        )
      }
      label="Authorize"
      hoverIndicator={{ color: "brand", opacity: "low" }}
      onClick={() => props.dispatch(getSpotifyAuthURL())}
    />
  </Box>
);

function mapStateToProps(state) {
  return {
    loading: state.processingSpotifyAuth,
    callback: {
      loading: state.processingCallback,
      error: state.callbackError,
      success: state.callbackSuccess,
    },
  };
}

export default connect(mapStateToProps)(SpotifyAuthButton);

const FailedSpotifyAuth = (props) => {
  return (
    <FlexibleContainer>
      <Box
        flex
        direction="column"
        justify="between"
        align="center"
        pad={{
          left: "medium",
          right: "small",
          top: "medium",
          bottom: "small",
        }}
      >
        <Heading level="3" textAlign="center">
          Failed to authorize with Spotify. Try again?
        </Heading>
        <Box pad={{ bottom: "medium" }}>
          <Text size="medium" textAlign="center">
            Make sure you click the "Agree" button on the following screen
          </Text>
        </Box>
        <SpotifyAuthButton {...props} />
      </Box>
    </FlexibleContainer>
  );
};

const _SpotifyCallback = (props) => {
  // check for valid Spotify callback
  // URL should have a .search with either code=x or error=x
  let search = props.location.search;
  if (!search) {
    return <Redirect to="/" />;
  }

  let queryParams = new URLSearchParams(props.location.search);
  if (!queryParams.get("error") && !queryParams.get("code")) {
    return <Redirect to="/" />;
  }

  let error = props.callback.error || queryParams.get("error");
  if (error) {
    return <FailedSpotifyAuth {...props} />;
  }

  if (!props.callback.loading && !props.callback.success) {
    // looks like we haven't forwarded the callback to the
    props.dispatch(spotifyCallback(queryParams));
  } else if (props.callback.success) {
    // refresh the user object
    props.dispatch(fetchUser());
    props.dispatch(SPOTIFY_CALLBACK.clear());
  }

  return props.callback.loading ? (
    <FlexibleContainer>
      <Box
        flex
        direction="column"
        justify="between"
        align="center"
        pad="medium"
      >
        <Heading level="3">Completing Authorization</Heading>
        <Loader color={theme.global.colors.brand} size={"30px"} />
      </Box>
    </FlexibleContainer>
  ) : (
    <Redirect to="/" />
  );
};

export const SpotifyCallback = connect(mapStateToProps)(_SpotifyCallback);
