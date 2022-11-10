import React, { Component } from "react";
import { Box, Skeleton } from "@mui/material";

export default class FeedItemContentProgress extends Component {
  render() {
    return (
      <>
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </Box>
      </>
    );
  }
}
