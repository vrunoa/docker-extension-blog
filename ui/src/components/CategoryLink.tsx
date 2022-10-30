import React, { Component } from "react";
import { ICategory } from "../interfaces";
import { Link } from "@mui/material";
import DesktopClientHelper from "../desktop";

export default class CategoryLink extends Component<ICategory> {
  desktop: DesktopClientHelper;

  constructor(props) {
    super(props);
    this.desktop = new DesktopClientHelper();
  }

  sanitizeCategory(category: string): string {
    category = category.toLowerCase();
    const whiteSpace = /[\s\.]/;
    category = category.replace(whiteSpace, "-");
    return category;
  }

  render() {
    const category = this.sanitizeCategory(this.props.category);
    const categoryLink = `https://docker.com/blog/tag/${category}`;
    return (
      <>
        <Link
          marginRight={1}
          onClick={() => this.desktop.openUrl(categoryLink)}
        >
          {category}
        </Link>
      </>
    );
  }
}
