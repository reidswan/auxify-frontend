import React from "react";
import { Box, Heading, Menu } from "grommet";
import { User, Lock } from "grommet-icons";
import iconImage from "../img/minimal-white.svg";
import AppBar from "./AppBar";
import { connect } from "react-redux";
import { redirect, logout } from "../actions";
import { isTokenExpired } from "../utils";

const Icon = (props) => {
  const styleWithDefaults = {
    width: "28px",
    height: "28px",
    paddingLeft: "2px",
    paddingRight: "2px",
    paddingTop: "4px",
    border: "2px solid white",
    borderRadius: "100%",
    ...props,
  };

  return (
    <img
      src={iconImage}
      alt="Auxify logo"
      aria-hidden={true}
      style={styleWithDefaults}
      {...props}
    />
  );
};

const AppHeader = (props) => {
  let loggedIn = !!props.token && !isTokenExpired(props.token);
  let icon = loggedIn ? <User /> : <Lock />;

  return (
    <AppBar>
      <Box
        direction="row"
        align="center"
        justify="start"
        gap="small"
        focusIndicator={false}
        onClick={() => props.dispatch(redirect("/"))}
      >
        <Icon />
        <Heading level="2" margin="none">
          Auxify
        </Heading>
      </Box>
      <Menu
        icon={icon}
        dropBackground={{ color: "focusBackground", opacity: "strong" }}
        dropAlign={{ top: "bottom", right: "right" }}
        focusIndicator={false}
        disabled={!loggedIn}
        items={[{ label: "Logout", onClick: () => props.dispatch(logout()) }]}
      />
    </AppBar>
  );
};

function mapStateToProps(state) {
  return {
    token: state.token,
  };
}

export default connect(mapStateToProps)(AppHeader);
