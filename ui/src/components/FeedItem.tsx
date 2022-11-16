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
import ShareIcon from "@mui/icons-material/Share";
import ShareDialog from "./ShareDialog";

const FeedItemContent = React.lazy(() => import("./FeedItemContent"));

export default class FeedItem extends Component<IItem, { share: boolean }> {
  desktop: DesktopClientHelper;

  constructor(props) {
    super(props);
    this.desktop = new DesktopClientHelper();
    this.state = {
      share: false,
    };
  }

  formatDate = (datetime: string): string => {
    return moment(datetime, "").fromNow();
  };

  shareIntent = (): void => {
    this.setState({ share: true });
  };

  guid = (): string => {
    let ur = new URL(this.props.item?.guid);
    let guid = ur?.searchParams.get("p");
    return guid;
  };

  render() {
    return (
      <>
        <ShareDialog
          item={this.props.item}
          open={this.state.share}
          onClose={() => {
            this.setState({ share: false });
          }}
        />
        <Box
          sx={{ flexGrow: 1 }}
          marginBottom={2}
          id={"feed-item-anchor-" + this.guid()}
        >
          <Card sx={{ flexGrow: 1 }}>
            <CardContent>
              <Stack
                direction={"row"}
                sx={{ position: "absolute", right: "4em" }}
                spacing={1}
              >
                <Tooltip title={"share"}>
                  <Fab size="small" onClick={() => this.shareIntent()}>
                    <ShareIcon />
                  </Fab>
                </Tooltip>
                <Tooltip title={"open"}>
                  <Fab
                    size="small"
                    onClick={() => this.desktop.openUrl(this.props.item.link)}
                  >
                    <LinkIcon />
                  </Fab>
                </Tooltip>
              </Stack>
              <Stack>
                <Typography variant="h6"
                  gutterBottom
                >
                  {this.props.item.title}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  by {this.props.item.author?.name} - {this.formatDate(this.props.item.published)}
                </Typography>
              </Stack>
              <Typography sx={{fontSize: 16}} component="div">
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
