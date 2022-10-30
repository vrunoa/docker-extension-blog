import React, { useEffect } from "react";
import {
  LinearProgress,
  Button,
} from "@mui/material";
import Box from "@mui/material/Box";
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
    const result = await desktop.get("/feed");
    setResponse(parseFeed(result));
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = () => {
    setVisible(true);
    fetchAndDisplayResponse().catch((err) => {
      console.error(err);
      desktop.toast("Failed to load feed! :(");
    }).finally(()=>{
      setVisible(false);
    });
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <TopBar />
      </Box>
      <Box sx={{ flexGrow: 1 }}>{visible && <LinearProgress />}</Box>
      <Feed feed={response} />
      <Box sx={{ flexGrow: 1 }}>{visible &&
        <Button
          sx={{ flexGrow: 1 }}
          fullWidth={true}
          variant={"contained"}
          onClick={() => {
            desktop.openUrl("https://docker.com/blog");
          }}
        >
          More
        </Button>}
      </Box>
    </>
  );
}
