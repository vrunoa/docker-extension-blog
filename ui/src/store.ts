class store {
  get = (key: string) => {
    return JSON.parse(localStorage.getItem(key));
  };
  set = (key: string, val: any) => {
    localStorage.setItem(key, JSON.stringify(val));
  };
  reset = () => {
    localStorage.clear();
  };
  remove = (key: string) => {
    localStorage.removeItem(key);
  };
}

const s = new store();

export default function getStore() {
  return s;
}
