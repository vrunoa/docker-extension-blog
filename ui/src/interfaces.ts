export interface Author {
  name: string;
}

export interface Item {
  title: string;
  published: string;
  description: string;
  author: Author;
  content: string;
  link: string;
  categories: Array<string>;
  guid: string;
}

export interface IItem {
  item: Item;
}

export interface IFeed {
  items: Array<Item>;
  updated: string;
}

export interface ICategory {
  category: string;
}

export interface Markup {
  __html: string;
}

type refresherFn = () => void;

export interface ITopBar {
  refresher: refresherFn;
}

type shareOnCloseFn = () => void;

export interface IItemShare {
  item: Item;
  open: boolean;
  onClose: shareOnCloseFn;
}
