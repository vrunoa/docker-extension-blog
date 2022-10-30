import React, {useEffect} from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import {Stack, Typography, Link, IconButton, LinearProgress, Button} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FaceBookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import YoutubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Feed from "./Feed";
import {FeedResponse, IFeed} from "./interfaces";

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

function parseFeed(result: any): FeedResponse {
    return {
        updated: result.Feed?.updated,
        items: result.Feed?.items,
    }
}

const links = {
    "fb": "https://www.facebook.com/docker.run",
    "tw": "https://www.facebook.com/docker.run",
    "yt": "https://www.youtube.com/user/dockerrun",
    "in": "https://www.linkedin.com/company/docker"
}

export function App() {
  const [response, setResponse] = React.useState<FeedResponse>();
  const [visible, setVisible] = React.useState<boolean>()
  const ddClient = useDockerDesktopClient();

  const fetchAndDisplayResponse = async () => {
      setVisible(true)
      const result = await ddClient.extension.vm?.service?.get('/feed');
      setResponse(parseFeed(result));
      setVisible(false)
  };

  const openUrl = (url: string) => {
    ddClient.host.openExternal(url);
  }

  useEffect(() => {
      fetchAndDisplayResponse()
  }, [])

  return (
    <>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="inherit">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="refresh"
                        sx={{ mr: 2 }}>
                        <RefreshIcon onClick={fetchAndDisplayResponse} />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Docker Blog
                    </Typography>
                    <Stack direction="row" alignItems="end">
                        <Button onClick={(el) => openUrl(links.fb)}>
                            <FaceBookIcon  />
                        </Button>
                        <Button onClick={(el) => openUrl(links.tw)}>
                            <TwitterIcon />
                        </Button>
                        <Button onClick={(el) => openUrl(links.yt)}>
                            <YoutubeIcon />
                        </Button>
                        <Button onClick={(el) => openUrl(links.in)}>
                            <LinkedInIcon />
                        </Button>
                    </Stack>
                </Toolbar>
            </AppBar>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
            {visible &&<LinearProgress />}
        </Box>
        <Feed feed={response} />
    </>
  );
}
