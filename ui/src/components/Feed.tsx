import React, { Component } from "react";
import {Typography} from "@mui/material";
import {IFeed} from "../interfaces";
import FeedItem from "./FeedItem";
import moment from "moment";

export default class Feed extends Component<IFeed> {

    formatUpdated(datetime: string): string {
        return moment(datetime).format("MMMM Do YYYY, h:mm:ss a");
    }

    render() {
        return <>
            <Typography variant="caption" component="div" sx={{ flexGrow: 1 }} align="right" padding={1}>
                Last updated: {this.formatUpdated(this.props.feed?.updated)}
            </Typography>
            {
                this.props.feed?.items?.map((item, i) => {
                    return item.description? <FeedItem item={item} /> : "";
                })
            }
        </>
    }
}
