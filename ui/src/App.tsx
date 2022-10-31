import React, { useEffect } from "react";
import { LinearProgress, Button } from "@mui/material";
import Box from "@mui/material/Box";
import Feed from "./components/Feed";
import { FeedResponse } from "./interfaces";
import DesktopClientHelper from "./desktop";
import TopBar from "./components/TopBar";

export function App() {
  const [response, setResponse] = React.useState<FeedResponse>();
  const [visible, setVisible] = React.useState<boolean>();
  const desktop = new DesktopClientHelper();

  const parseFeed = (result: any): FeedResponse => {
    return {
      updated: result.Feed?.updated,
      items: result.Feed?.items,
    };
  };

  const fetchAndDisplayResponse = async () => {
    const result = await desktop.get("/feed");
    setResponse(parseFeed(result));
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = () => {
    setVisible(true);
    fetchAndDisplayResponse()
      .catch((err) => {
        console.error(err);
        desktop.toast("Failed to load blog feed. Try again in a bit");
      })
      .finally(() => {
        setVisible(false);
      });
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <TopBar refresher={fetchFeed} />
      </Box>
      <Box sx={{ flexGrow: 1 }}>{visible && <LinearProgress />}</Box>
      <Feed feed={response} />
      <Box sx={{ flexGrow: 1 }}>
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
      </Box>
    </>
  );
}
