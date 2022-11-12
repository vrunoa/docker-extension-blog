import React, { Component } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import FaceBookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { TransitionProps } from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import DesktopClientHelper from "../desktop";
import { IItemShare } from "../interfaces";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default class ShareDialog extends Component<IItemShare> {
  desktop: DesktopClientHelper;

  constructor(props) {
    super(props);
    this.desktop = new DesktopClientHelper();
  }

  tweet = () => {
    let intent = `https://twitter.com/intent/tweet`;
    intent += `?text=${encodeURIComponent("I love this post!")}`;
    intent += `&url=${encodeURIComponent(this.props.item.link)}`;
    intent += `&hashtags=docker`;
    intent += `&via=docker`;
    this.desktop.openUrl(intent);
  };

  in = () => {
    let intent = `https://www.linkedin.com/shareArticle?`;
    intent += `&url=${encodeURIComponent(this.props.item.link)}`;
    intent += `&title=${encodeURIComponent(this.props.item.title)}`;
    intent += `&summary=${encodeURIComponent(this.props.item.description)}`;
    intent += `&source=@docker`;
    this.desktop.openUrl(intent);
  };

  fb = () => {
    let intent = `https://www.facebook.com/dialog/share?`;
    intent += `app_id=682320446554526`;
    intent += `&display=popup`;
    intent += `&href=${encodeURIComponent(this.props.item.link)}}`;
    intent += `&redirect_uri=https://www.docker.com/blog`;
    this.desktop.openUrl(intent);
  };

  render() {
    return (
      <>
        <Dialog
          open={this.props.open}
          TransitionComponent={Transition}
          onClose={this.props.onClose}
        >
          <DialogTitle style={{ fontWeight: "bold" }}>
            {this.props.item?.title}
          </DialogTitle>
          <DialogContent dividers>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Share this awesome post on
            </Typography>
            <div>
              <Stack direction={"row"}>
                <IconButton
                  onClick={() => {
                    this.tweet();
                  }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    this.fb();
                  }}
                >
                  <FaceBookIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    this.in();
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
              </Stack>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}
