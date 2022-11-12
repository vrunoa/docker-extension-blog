import { CheerioAPI, load } from "cheerio";
import { Component } from "react";
import { IItem, Markup } from "../interfaces";

const sanitizers = {
  video: ($: CheerioAPI) => {
    const videos = $("video");
    for (let el of videos) {
      el.attribs.width = "100%";
    }
  },
  iframe: ($: CheerioAPI) => {
    const iframes = $("iframe");
    for (let el of iframes) {
      el.attribs.width = "100%";
      el.attribs.frameBorder = "0";
      delete el.attribs.allow;
    }
  },
  ael: ($: CheerioAPI) => {
    const as = $("a");
    for (let el of as) {
      const href = el.attribs.href;
      if (href.startsWith("#")) {
        continue;
      }
      el.attribs.target = "_blank";
      el.attribs.onclick = `eval(window.ddClient.host.openExternal("${href}"))`;
    }
  },
  img: ($: CheerioAPI) => {
    const imgs = $("img");
    for (let el of imgs) {
      el.attribs.width = "100%";
      delete el.attribs.height;
    }
  },
};

function sanitize(content: string, debug = false): string {
  const $ = load(content);
  for (let s of Object.keys(sanitizers)) {
    sanitizers[s]($);
  }
  if (debug) {
    console.log($("body").html());
  }
  return $("body").html();
}

function markup(content): Markup {
  return { __html: sanitize(content) };
}

export default class FeedItemContent extends Component<IItem> {
  render() {
    return (
      <>
        <div
          className={"feed-item-content"}
          dangerouslySetInnerHTML={markup(this.props.item.content)}
        />
      </>
    );
  }
}
