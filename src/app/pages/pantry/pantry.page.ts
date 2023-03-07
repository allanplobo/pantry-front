import { NotificationsService } from './../../services/notifications.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { finalize } from 'rxjs';
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
  products!: IProduct[];

  constructor(
    private productsService: ProductsService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  async getAllProducts() {
    const load = await this.showLoading('Loading products...');
    this.productsService
      .getProducts()
      .pipe(finalize(() => load.dismiss()))
      .subscribe((response) => {
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
      const load = await this.showLoading('Saving new product...');
      this.productsService
        .newProduct(data)
        .pipe(finalize(() => load.dismiss()))
        .subscribe((response) => {
          this.products.push(response);
          this.notificationsService.showToast(
            `Product ${response.name} was successfully created`,
            'success'
          );
        });
    }
  }

  private async showLoading(message: string): Promise<HTMLIonLoadingElement> {
    const load = await this.loadingCtrl.create({
      message: message,
    });
    load.present();
    return load;
  }
}
