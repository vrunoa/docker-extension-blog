import React, { Component } from "react";
import Toolbar from "@mui/material/Toolbar";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import FaceBookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YoutubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import AppBar from "@mui/material/AppBar";
import DesktopClientHelper from "../desktop";

const links = {
  fb: "https://www.facebook.com/docker.run",
  tw: "https://www.facebook.com/docker.run",
  yt: "https://www.youtube.com/user/dockerrun",
  in: "https://www.linkedin.com/company/docker",
};

export default class TopBar extends Component {
  desktop: DesktopClientHelper;

  constructor(props) {
    super(props);
    this.desktop = new DesktopClientHelper();
  }

  render() {
    return (
      <>
        <AppBar position="static" color="inherit">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="refresh"
              sx={{ mr: 2 }}
            >
              <RefreshIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Docker Blog
            </Typography>
            <Stack direction="row" alignItems="end">
              <Button onClick={(el) => this.desktop.openUrl(links.fb)}>
                <FaceBookIcon />
              </Button>
              <Button onClick={(el) => this.desktop.openUrl(links.tw)}>
                <TwitterIcon />
              </Button>
              <Button onClick={(el) => this.desktop.openUrl(links.yt)}>
                <YoutubeIcon />
              </Button>
              <Button onClick={(el) => this.desktop.openUrl(links.in)}>
                <LinkedInIcon />
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>
      </>
    );
  }
}
