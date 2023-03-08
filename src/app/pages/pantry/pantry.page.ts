import { Component, OnInit } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { finalize, Observable } from 'rxjs';
import { FeedbackService } from '../../services/feedback.service';
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
  products$!: Observable<IProduct[]>;

  constructor(
    private productsService: ProductsService,
    private modalCtrl: ModalController,
    private feedbackService: FeedbackService,
    private actionSheetCtrl: ActionSheetController,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  async getAllProducts() {
    const load = await this.feedbackService.showLoading('Loading products...');
    this.products$ = this.productsService
      .getProducts()
      .pipe(finalize(() => load.dismiss()));
  }

  async createProduct() {
    const modal = await this.modalCtrl.create({
      component: ProductFormComponent,
    });
    modal.present();
    const { data } = await modal.onWillDismiss();

    if (data) {
      this.feedbackService.showToast(
        `Product ${data.name} was successfully created`,
        'success'
      );
      this.getAllProducts();
    }
  }

  async openActionOptions(product: IProduct) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: `What you want to do with ${product.name}?`,
      buttons: [
        {
          text: 'See details',
        },
        {
          text: 'Edit',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await this.handleDelete(product);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();
  }

  async handleDelete(product: IProduct): Promise<void> {
    const alert = await this.alertController.create({
      header: `Delete ${product.name}`,
      message: 'Are you sure you want to remove this product?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            this.deleteProduct(product);
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteProduct(product: IProduct) {
    const load = await this.feedbackService.showLoading('Deleting product...');
    this.productsService
      .deleteProduct(product._id || '')
      .pipe(finalize(() => load.dismiss()))
      .subscribe(() => {
        this.feedbackService.showToast(
          `${product.name} deleted successfully!`,
          'success'
        );
        this.getAllProducts();
      });
  }
}
