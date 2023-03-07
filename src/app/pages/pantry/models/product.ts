export interface IProduct {
  id?: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
}

export class Product {
  name: string;
  description?: string;
  quantity: number;
  price: number;

  constructor(
    name: string,
    description: string,
    quantity: number,
    price: number
  ) {
    this.name = name;
    this.description = description;
    this.quantity = quantity;
    this.price = price;
  }
}
