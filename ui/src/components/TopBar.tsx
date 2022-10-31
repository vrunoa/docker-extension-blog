import React, { Component } from "react";
import Toolbar from "@mui/material/Toolbar";
import { Card, IconButton, Stack, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import FaceBookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YoutubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import DesktopClientHelper from "../desktop";
import { ITopBar } from "../interfaces";

const links = {
  fb: "https://www.facebook.com/docker.run",
  tw: "https://www.facebook.com/docker.run",
  yt: "https://www.youtube.com/user/dockerrun",
  in: "https://www.linkedin.com/company/docker",
};

export default class TopBar extends Component<ITopBar> {
  desktop: DesktopClientHelper;

  constructor(props) {
    super(props);
    this.desktop = new DesktopClientHelper();
  }

  render() {
    return (
      <>
        <Card sx={{ flexGrow: 1 }}>
          <Toolbar>
            <IconButton
              edge="start"
              size={"small"}
              onClick={() => this.props.refresher()}
            >
              <RefreshIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Docker Blog
            </Typography>
            <Stack direction="row" alignItems="end">
              <IconButton
                size={"small"}
                onClick={(el) => this.desktop.openUrl(links.fb)}
              >
                <FaceBookIcon />
              </IconButton>
              <IconButton
                size={"small"}
                onClick={(el) => this.desktop.openUrl(links.tw)}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                size={"small"}
                onClick={(el) => this.desktop.openUrl(links.yt)}
              >
                <YoutubeIcon />
              </IconButton>
              <IconButton
                size={"small"}
                onClick={(el) => this.desktop.openUrl(links.in)}
              >
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </Toolbar>
        </Card>
      </>
    );
  }
}
