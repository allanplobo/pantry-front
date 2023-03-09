import { Component, OnInit } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { finalize, Observable, catchError } from 'rxjs';
import { FeedbackService } from '../../services/feedback.service';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
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
  searchingProductByName = false;

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
    this.products$ = this.productsService.getProducts().pipe(
      finalize(() => load.dismiss()),
      catchError((error) => {
        console.error('Error in Pantry Page ->  getAllProducts', error);
        return [];
      })
    );
  }

  async createProduct() {
    const modal = await this.modalCtrl.create({
      component: ProductDetailsComponent,
      componentProps: {
        enableProductForm: true,
      },
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
          handler: () => {
            this.seeProductDetails(product);
          },
        },
        {
          text: 'Edit',
          handler: () => {
            this.handleEditProduct(product);
          },
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

  async seeProductDetails(product: IProduct) {
    const modal = await this.modalCtrl.create({
      component: ProductDetailsComponent,
      componentProps: {
        productInfo: product,
      },
    });

    modal.present();
    await modal.onWillDismiss().then(({ data }) => {
      if (data) {
        this.feedbackService.showToast(
          `Product edited successfully!`,
          'success'
        );
        this.getAllProducts();
      }
    });
  }

  async handleEditProduct(product: IProduct) {
    const modal = await this.modalCtrl.create({
      component: ProductDetailsComponent,
      componentProps: {
        productInfo: product,
        enableProductForm: true,
      },
    });

    modal.present();
    await modal.onWillDismiss().then(({ data }) => {
      if (data) {
        this.feedbackService.showToast(
          `Product edited successfully!`,
          'success'
        );
        this.getAllProducts();
      }
    });
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

  searchByName(searchEvent: unknown) {
    const customEvent = searchEvent as CustomEvent;
    this.searchingProductByName = true;
    this.products$ = this.productsService
      .searchProductByName(customEvent.detail.value)
      .pipe(
        finalize(() => (this.searchingProductByName = false)),
        catchError((error) => {
          console.error('Error in Pantry Page ->  searchByName', error);
          return [];
        })
      );
  }
}
