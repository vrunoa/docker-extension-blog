import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Box,
  Stack,
  Fab,
  Tooltip,
  Link,
  CircularProgress,
} from "@mui/material";
import { IItem } from "../interfaces";
import React, { Component } from "react";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import LinkIcon from "@mui/icons-material/Link";
import moment from "moment";
import CategoryLink from "./CategoryLink";
import DesktopClientHelper from "../desktop";
import { KeyboardArrowUp } from "@mui/icons-material";
import FeedItemContentProgress from "./FeedItemContentProgress";

const FeedItemContent = React.lazy(() => import("./FeedItemContent"));

export default class FeedItem extends Component<IItem> {
  desktop: DesktopClientHelper;

  constructor(props) {
    super(props);
    this.desktop = new DesktopClientHelper();
  }

  formatDate = (datetime: string): string => {
    return moment(datetime, "").fromNow();
  };

  guid = (): string => {
    let ur = new URL(this.props.item?.guid);
    let guid = ur?.searchParams.get("p");
    return guid;
  };

  render() {
    return (
      <>
        <Box
          sx={{ flexGrow: 1 }}
          marginBottom={2}
          id={"feed-item-anchor-" + this.guid()}
        >
          <Card sx={{ flexGrow: 1 }}>
            <CardContent>
              <Stack sx={{ position: "absolute" }}>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  {this.props.item.title} -{" "}
                  {this.formatDate(this.props.item.published)}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  by {this.props.item.author?.name}
                </Typography>
              </Stack>
              <Stack
                sx={{ flexGrow: 1, marginBottom: "1em" }}
                alignItems={"end"}
              >
                <Tooltip title={"open"}>
                  <Fab
                    size="small"
                    onClick={() => this.desktop.openUrl(this.props.item.link)}
                  >
                    <LinkIcon />
                  </Fab>
                </Tooltip>
              </Stack>
              <Typography variant="h6" component="div">
                {this.props.item.description}
              </Typography>
              <Typography variant="body2" component="div">
                <React.Suspense fallback={<FeedItemContentProgress />}>
                  <FeedItemContent item={this.props.item} />
                </React.Suspense>
              </Typography>
            </CardContent>
            <CardActions>
              <Stack direction="row" sx={{ flexGrow: 1 }}>
                <Link
                  href={"#feed-item-anchor-" + this.guid()}
                  sx={{ position: "absolute", right: "3em" }}
                >
                  <KeyboardArrowUp />
                </Link>
                <LocalOfferIcon sx={{ marginRight: "0.5em" }} />
                {this.props.item.categories?.map((cat, i) => {
                  return (
                    <CategoryLink category={cat} key={`category-${cat}-i`} />
                  );
                })}
              </Stack>
            </CardActions>
          </Card>
        </Box>
      </>
    );
  }
}
