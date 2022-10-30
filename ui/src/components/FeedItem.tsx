import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Box,
  Stack,
  Fab,
} from "@mui/material";
import { IItem } from "../interfaces";
import React, { Component } from "react";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import LinkIcon from "@mui/icons-material/Link";
import moment from "moment";
import CategoryLink from "./CategoryLink";
import ItemContent from "./ItemContent";
import DesktopClientHelper from "../desktop";

export default class FeedItem extends Component<IItem> {
  desktop: DesktopClientHelper;

  constructor(props) {
    super(props);
    this.desktop = new DesktopClientHelper();
  }

  formatDate = (datetime: string): string => {
    return moment(datetime, "").fromNow();
  };

  render() {
    return (
      <>
        <Box sx={{ flexGrow: 1 }} marginBottom={2}>
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
                  by {this.props.item.author.name}
                </Typography>
              </Stack>
              <Stack
                sx={{ flexGrow: 1, marginBottom: "1em" }}
                alignItems={"end"}
              >
                <Fab
                  size="small"
                  onClick={() => this.desktop.openUrl(this.props.item.link)}
                >
                  <LinkIcon />
                </Fab>
              </Stack>
              <Typography variant="h6" component="div">
                {this.props.item.description}
              </Typography>
              <Typography variant="body2">
                <ItemContent item={this.props.item} />
              </Typography>
            </CardContent>
            <CardActions>
              <Stack direction="row" alignItems="end" sx={{ flexGrow: 1 }}>
                <LocalOfferIcon sx={{ marginRight: "0.5em" }} />
                {this.props.item?.categories?.map((cat, i) => {
                  return <CategoryLink category={cat} />;
                })}
              </Stack>
            </CardActions>
          </Card>
        </Box>
      </>
    );
  }
}
