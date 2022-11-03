import React, { useEffect } from "react";
import { LinearProgress, Button } from "@mui/material";
import Box from "@mui/material/Box";
import Feed from "./components/Feed";
import { IFeed, Item } from "./interfaces";
import DesktopClientHelper from "./desktop";
import TopBar from "./components/TopBar";

export function App() {
  const [page, setPage] = React.useState<number>(1);
  const [updated, setUpdated] = React.useState<string>();
  const [feed, setFeed] = React.useState<Array<Item>>([]);
  const [visible, setVisible] = React.useState<boolean>(false);
  const desktop = new DesktopClientHelper();

  const parseFeed = (result: any): IFeed => {
    return {
      updated: result.Feed?.updated,
      items: result.Feed?.items,
    };
  };

  const fetchAndDisplayResponse = async () => {
    const raw = await desktop.get(`/feed?page=${page}`);
    const result = parseFeed(raw);
    setFeed(feed?.concat(result.items));
    setUpdated(result.updated);
    setPage(page + 1);
  };

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

  useEffect(() => {
    fetchFeed();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <TopBar refresher={fetchFeed} />
      </Box>
      <Box sx={{ flexGrow: 1 }}>{visible && <LinearProgress />}</Box>
      <Feed items={feed} updated={updated} />
      <Box sx={{ flexGrow: 1 }}>
        <Button
          sx={{ flexGrow: 1 }}
          fullWidth={true}
          variant={"contained"}
          onClick={() => {
            fetchFeed();
          }}
        >
          More
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1 }}>{visible && <LinearProgress />}</Box>
    </>
  );
}
