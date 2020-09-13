import React from "react";
import { Box, Text, Button } from "grommet";
import { FormNext } from "grommet-icons";
import history from "../history";
import theme from "../styles/theme";

const DEFAULT_NOT_FOUND = "We couldn't find what you were looking for";

export default (props) => {
  let message = props.message || DEFAULT_NOT_FOUND;
  return (
    <Box flex align="center" justify="between" style={{ minHeight: "80px" }}>
      <Text size="large">{message}</Text>
      <Button
        primary
        reverse
        color={theme.global.colors.brand}
        size="medium"
        icon={<FormNext />}
        label="Go home"
        onClick={() => history.push("/")}
      />
    </Box>
  );
};
