import { Component } from '@angular/core';
import { Product } from './models/product';

@Component({
  selector: 'app-pantry',
  templateUrl: 'pantry.page.html',
  styleUrls: ['pantry.page.scss'],
})
export class PantryPage {
  productsMock = [
    { name: 'Arroz', quantity: 50, price: 16 },
    { name: 'Feijão', quantity: 1, price: 10 },
  ];

  products: Product[] = this.productsMock;

  constructor() {}
}
