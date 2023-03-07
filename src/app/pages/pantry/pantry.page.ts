import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { IProduct, Product } from './models/product';
import { ProductsService } from './services/products.service';

@Component({
  selector: 'app-pantry',
  templateUrl: 'pantry.page.html',
  styleUrls: ['pantry.page.scss'],
  providers: [ProductsService],
})
export class PantryPage implements OnInit {
  loadingProducts = true;
  products!: IProduct[];

  constructor(
    private productsService: ProductsService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(): void {
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

    if (data) {
      this.productsService.newProduct(data).subscribe((response) => {
        console.log('SAVED', response);
        this.products.push(data);
      });
    }
  }
}
