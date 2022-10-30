import React, { Component } from "react";
import {Typography} from "@mui/material";
import {FeedResponse, IFeed} from "./interfaces";
import CardItem from "./Card";
import moment from "moment";

export default class Feed extends Component<IFeed> {

    feed: FeedResponse

    constructor(props) {
        super(props);
        this.feed = props.feed
    }

    formatUpdated(datetime: string): string {
        return moment(datetime).format("MMMM Do YYYY, h:mm:ss a");
    }

    render() {
        return <>
            <Typography variant="caption" component="div" sx={{ flexGrow: 1 }} align="right" padding={1}>
                Last updated: {this.formatUpdated(this.props?.feed?.updated)}
            </Typography>
            {
                this.props?.feed?.items?.map((item, i) => {
                    if (item.description) return <CardItem item={item} />
                })
            }
        </>
    }
}
