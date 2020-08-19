import React from "react";
import { Box, Button, Heading } from "grommet";
import { User } from "grommet-icons";
import iconImage from "../img/minimal-white.svg";
import AppBar from "./AppBar";
import { connect } from "react-redux";
import { redirect } from "../actions";

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
      <Button icon={<User />} onClick={() => console.log("clicked right")} />
    </AppBar>
  );
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(AppHeader);
