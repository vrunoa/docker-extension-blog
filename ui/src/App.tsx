import React, { useEffect } from "react";
import { LinearProgress, Button, Fab } from "@mui/material";
import Box from "@mui/material/Box";
import Feed from "./components/Feed";
import { IFeed, Item } from "./interfaces";
import DesktopClientHelper from "./desktop";
import TopBar from "./components/TopBar";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";

let page = 1;
let items = [];

export function App() {
  const [updated, setUpdated] = React.useState<string>();
  const [feed, setFeed] = React.useState<Array<Item>>([]);
  const [progressTop, setProgressTop] = React.useState<boolean>(false);
  const [progressBottom, setProgressBottom] = React.useState<boolean>(false);
  const [scroll, setScroll] = React.useState<boolean>(false);
  const desktop = new DesktopClientHelper();

  const parseFeed = (result: any): IFeed => {
    return {
      updated: result.Feed?.updated,
      items: result.Feed?.items,
    };
  };

  const fetchAndDisplayResponse = async (p: number): Promise<IFeed> => {
    const raw = await desktop.get(`/feed?page=${p}`);
    return parseFeed(raw);
  };

  const fetchFeed = (progressBottom) => {
    setProgressTop(!progressBottom);
    setProgressBottom(progressBottom);
    fetchAndDisplayResponse(page)
      .then((result) => {
        items = items?.concat(result.items);
        setFeed(items);
        setUpdated(result.updated);
      })
      .catch((err) => {
        console.error(err);
        desktop.toast("Failed to load blog feed. Try again in a bit");
      })
      .finally(() => {
        setProgressTop(false);
        setProgressBottom(false);
        page++;
      });
  };

  const initialFeed = () => {
    page = 1;
    items = [];
    fetchFeed(false);
  };

  const handleScroll = (): void => {
    const st = window.scrollY || document.documentElement.scrollTop;
    const barEl = window.document.getElementById("top-bar-box");
    const moreEl = window.document.getElementById("more-button-box");
    if (
      st > barEl.offsetHeight + 50 &&
      st < moreEl.offsetTop - window.innerHeight
    ) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  useEffect(() => {
    initialFeed();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {scroll && (
        <Fab
          id={"fab-up"}
          size="small"
          sx={{ position: "fixed", bottom: 10, right: 10 }}
          onClick={() => window.scroll(0, 0)}
        >
          <KeyboardArrowUpRoundedIcon />
        </Fab>
      )}
      <Box sx={{ flexGrow: 1 }} id={"top-bar-box"}>
        <TopBar refresher={initialFeed} />
      </Box>
      <Box sx={{ flexGrow: 1 }}>{progressTop && <LinearProgress />}</Box>
      <Feed items={feed} updated={updated} />
      <Box sx={{ flexGrow: 1, marginBottom: 2 }}>
        {progressBottom && <LinearProgress />}
      </Box>
      <Box sx={{ flexGrow: 1 }} id={"more-button-box"}>
        <Button
          sx={{ flexGrow: 1 }}
          fullWidth={true}
          variant={"contained"}
          onClick={() => {
            fetchFeed(true);
          }}
        >
          More
        </Button>
      </Box>
    </>
  );
}
