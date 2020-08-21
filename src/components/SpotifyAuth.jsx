import React from "react";
import { Button, Box } from "grommet";
import { Spotify } from "grommet-icons";


export default (props) => (
  <Box flex direction="row" justify="center" pad="small">
    <Button size="large" icon={<Spotify color="brand" />} label="Authorize" />
  </Box>
);
