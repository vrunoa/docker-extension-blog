import {CheerioAPI, load} from 'cheerio';
import {Component} from "react";
import {IItem} from "../interfaces";

const sanitizers = {
    video: ($: CheerioAPI) => {
        const videos = $("video")
        for (let el of videos) {
            el.attribs.width = "100%"
        }
    },
    a: ($: CheerioAPI) => {
        const as = $("a")
        for (let el of as) {
            const href = el.attribs.href;
            if (href.startsWith("#")) {
                continue;
            }
            delete el.attribs.href;
            delete el.attribs.rel;
            delete el.attribs.target;
            // el.attribs.href = "#"
        }
    },
    img: ($: CheerioAPI) => {
        const imgs = $("img")
        for (let el of imgs) {
            el.attribs.width = "100%"
            delete el.attribs.height
        }
    }
}

function sanitize(content: string): string {
    const $ = load(content)
    for (let s of Object.keys(sanitizers)) {
        sanitizers[s]($)
    }
    console.log($("body").html())
    return $("body").html()
}

function markup(content): any {
    return {__html: sanitize(content)}
}

export default class ItemContent extends Component <IItem>{

    render() {
        return <>
            <div className={"content"} dangerouslySetInnerHTML={markup(this.props.item.content)} />
        </>
    }
}
