import React, {Component} from "react";
import {IconButton, Menu, MenuItem} from "@mui/material";
import BugReportIcon from '@mui/icons-material/BugReport';
import GitHubIcon from '@mui/icons-material/GitHub';
import {MoreVert} from "@mui/icons-material";
import DesktopClientHelper from "../desktop";

const links = {
  'bug': 'https://github.com/vrunoa/docker-extension-blog/issues',
  'code': 'https://github.com/vrunoa/docker-extension-blog'
}

const ITEM_HEIGHT = 48;

export default class MoreMenu extends Component<any, {anchor: boolean, anchorEl: HTMLElement}> {

  desktop: DesktopClientHelper

  constructor(props) {
    super(props);
    this.state = {
      anchor: false,
      anchorEl: null
    }
    this.desktop = new DesktopClientHelper();
  }

  handleState = (ev: React.MouseEvent<HTMLElement>, state = false): void => {
    this.setState({anchor: state, anchorEl: ev?.currentTarget});
  }

  handleMenuClick = (lnk: string): void => {
    this.handleState(null, false);
    this.desktop.openUrl(links[lnk]);
  }

  render() {
    return <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={this.state.anchor ? 'long-menu' : undefined}
        aria-expanded={this.state.anchor ? 'true' : undefined}
        onClick={(ev) => {this.handleState(ev, !this.state.anchor)}}
        size={"small"}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="long-menu"
        open={this.state.anchor}
        onClose={() => {this.handleState(null, false)}}
        anchorEl={this.state.anchorEl}
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
        sx={{top:10}}
      >
        <MenuItem onClick={() => {this.handleMenuClick('bug')}} key={"more-item-bug"}>
          <BugReportIcon />&nbsp;Bug report
        </MenuItem>
        <MenuItem onClick={() => {this.handleMenuClick('code')}} key={"more-item-code"}>
          <GitHubIcon />&nbsp;Source Code
        </MenuItem>
      </Menu>
    </>
  }
}