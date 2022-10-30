import React, { useEffect } from "react";
import { createDockerDesktopClient } from "@docker/extension-api-client";
import {
  Stack,
  Typography,
  IconButton,
  LinearProgress,
  Button,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import FaceBookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YoutubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Feed from "./components/Feed";
import { FeedResponse } from "./interfaces";
import DesktopClientHelper from "./desktop";
import TopBar from "./components/TopBar";

function parseFeed(result: any): FeedResponse {
  return {
    updated: result.Feed?.updated,
    items: result.Feed?.items,
  };
}

export function App() {
  const [response, setResponse] = React.useState<FeedResponse>();
  const [visible, setVisible] = React.useState<boolean>();
  const desktop = new DesktopClientHelper();

  const fetchAndDisplayResponse = async () => {
    setVisible(true);
    const result = await desktop.get("/feed");
    setResponse(parseFeed(result));
    setVisible(false);
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = () => {
    fetchAndDisplayResponse().catch((err) => {
      console.error(err);
      desktop.toast("Failed to load feed! :(");
    });
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <TopBar />
      </Box>
      <Box sx={{ flexGrow: 1 }}>{visible && <LinearProgress />}</Box>
      <Feed feed={response} />
      <Button
        sx={{ flexGrow: 1 }}
        fullWidth={true}
        variant={"contained"}
        onClick={() => {
          desktop.openUrl("https://docker.com/blog");
        }}
      >
        More
      </Button>
    </>
  );
}
