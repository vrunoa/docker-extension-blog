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
    const reFixer = /[\s\.]/;
    category = category.replace(reFixer, "-");
    return category;
  }

  render() {
    const category = this.sanitizeCategory(this.props.category);
    const categoryLink = `https://docker.com/blog/tag/${category}`;
    return (
      <>
        <Link
          marginRight={1}
          href={categoryLink}
          target={"_blank"}
          onClick={() => this.desktop.openUrl(categoryLink)}
        >
          {category}
        </Link>
      </>
    );
  }
}
