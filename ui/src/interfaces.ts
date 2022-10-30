import {DockerDesktopClient} from "@docker/extension-api-client-types/dist/v1";

export interface Author {
    name: string,
}

export interface Item {
    title: string,
    published: string,
    description: string,
    author: Author,
    content: string,
    link: string,
    categories: Array<string>
}

export interface IItem {
    item: Item
}

export interface IFeed {
    feed: FeedResponse
}

export interface FeedResponse {
    updated: string,
    items: Array<Item>
}

export interface ICategory {
    category: string
}
