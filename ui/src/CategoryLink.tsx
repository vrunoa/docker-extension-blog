import React, {Component} from "react";
import {ICategory} from "./interfaces";
import {Link} from "@mui/material";
import {createDockerDesktopClient} from "@docker/extension-api-client";

const client = createDockerDesktopClient();

export default class CategoryLink extends Component<ICategory> {

    constructor(props) {
        super(props);
    }

    sanitizeCategory(category: string): string {
        category = category.toLowerCase();
        const whiteSpace = /\s/
        category = category.replace(whiteSpace, "-")
        return category
    }

    openUrl(url: string) {
        client.host.openExternal(url);
    }

    render () {
        const category = this.sanitizeCategory(this.props.category)
        const categoryLink = `https://docker.com/blog/tag/${category}`
        return <>
            <Link underline={"none"} marginRight={1} onClick={() => this.openUrl(categoryLink)}>{category}</Link>
        </>
    }
}