import {Button, Card, CardActions, CardContent, Divider, Typography, Box, Stack, Link, Fab} from "@mui/material";
import {IItem, Item} from "./interfaces";
import React, {Component} from "react";
import InnerHTML from "./Content";
import {DockerDesktopClient} from "@docker/extension-api-client-types/dist/v1";
import {createDockerDesktopClient} from "@docker/extension-api-client";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LinkIcon from '@mui/icons-material/Link';
import moment from "moment";
import CategoryLink from "./CategoryLink";

export default class CardItem extends Component<IItem> {

    client: DockerDesktopClient

    constructor(props) {
        super(props);
        this.client = createDockerDesktopClient();
    }

    openUrl = (url: string) => {
        this.client.host.openExternal(url);
    }

    formatDate = (datetime: string) => {
        return moment(datetime, "").fromNow()
    }

    render() {
        return <>
            <Box sx={{ flexGrow: 1 }} marginBottom={2}>
                <Card sx={{ flexGrow: 1 }}>
                    <CardContent>
                        <Stack sx={{ position: "absolute"}}>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                {this.props.item.title} - {this.formatDate(this.props.item.published)}
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                by {this.props.item.author.name}
                            </Typography>
                        </Stack>
                        <Stack sx={{ flexGrow: 1, marginBottom: "1em" }} alignItems={"end"}>
                            <Fab size="small" onClick={() => this.openUrl(this.props.item.link)}>
                                <LinkIcon />
                            </Fab>
                        </Stack>
                        <Typography variant="h6" component="div">
                            {this.props.item.description}
                        </Typography>
                        <Typography variant="body2">
                            <InnerHTML item={this.props.item} />
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Stack direction="row" alignItems="end" sx={{ flexGrow: 1 }}>
                            <LocalOfferIcon sx={{marginRight: "0.5em"}} />
                            {this.props.item.categories.map((cat, i) => { return <CategoryLink category={cat} /> })}
                        </Stack>
                    </CardActions>
                </Card>
            </Box>
        </>
    }
}
