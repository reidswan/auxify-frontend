import React from "react";
import { Box } from "grommet";

const DEFAULT_STYLE = {
  minHeight: "150px",
  width: "75vw",
  maxWidth: "700px",
  minWidth: "320px",
};

export default (props) => {
  let style;
  if (!!props.style) {
    style = { ...DEFAULT_STYLE, ...props.style };
    delete props.style;
  } else {
    style = DEFAULT_STYLE;
  }
  return (
    <Box
      background="focusBackground"
      round
      margin={{ top: "10vh" }}
      justify="start"
      style={style}
      {...props}
    ></Box>
  );
};