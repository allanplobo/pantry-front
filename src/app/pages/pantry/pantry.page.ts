import { ProductsService } from './services/products.service';
import { Component, OnInit } from '@angular/core';
import { Product } from './models/product';

@Component({
  selector: 'app-pantry',
  templateUrl: 'pantry.page.html',
  styleUrls: ['pantry.page.scss'],
  providers: [ProductsService],
})
export class PantryPage implements OnInit {
  loadingProducts = true;
  productsMock = [
    { name: 'Arroz', quantity: 50, price: 16 },
    { name: 'Feijão', quantity: 1, price: 10 },
  ];

  products: Product[] = this.productsMock;

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.getProducts().subscribe((response) => {
      this.products = response;
    });
  }
}
