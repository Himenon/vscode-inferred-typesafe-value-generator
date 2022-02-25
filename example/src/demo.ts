export interface User {
  name: string;
}

export interface Item {
  id: string;
  name: string;
  cost: number;
}

export interface Cart {
  user: User;
  items: Item[];
}

const user: User = { name: "" };
const item: Item = { id: "", name: "", cost: 0 };
const cart: Cart = {
  user: { name: "" },
  items: [item, { id: "", name: "", cost: 0 }],
};
