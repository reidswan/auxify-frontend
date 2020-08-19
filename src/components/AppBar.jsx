import React from "react";
import { Box } from "grommet";

export default (props) => (
  <Box
    tag="header"
    direction="row"
    align="center"
    justify="between"
    pad={{ left: "medium", right: "medium", vertical: "small" }}
    style={{ zIndex: "1" }}
    {...props}
  />
);
