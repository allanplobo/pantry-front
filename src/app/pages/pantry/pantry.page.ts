import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { IProduct } from './models/product';
import { ProductsService } from './services/products.service';

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

  products: IProduct[] = this.productsMock;

  constructor(
    private productsService: ProductsService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    this.productsService.getProducts().subscribe((response) => {
      this.products = response;
    });
  }

  async createProduct() {
    const modal = await this.modalCtrl.create({
      component: ProductFormComponent,
    });
    modal.present();
    const { data } = await modal.onWillDismiss();
    console.log('DATA FROM FORM', data);
  }
}
