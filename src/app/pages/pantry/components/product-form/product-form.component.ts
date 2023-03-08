import { ProductsService } from './../../services/products.service';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ModalController,
  IonicModule,
  LoadingController,
} from '@ionic/angular';
import { IProduct, Product } from '../../models/product';
import { finalize } from 'rxjs';

interface ProductForm {
  id?: FormControl<string>;
  name: FormControl<string>;
  description?: FormControl<string>;
  quantity: FormControl<number | null>;
  price: FormControl<number | null>;
}

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, IonicModule],
  providers: [ProductsService],
})
export class ProductFormComponent implements OnInit {
  productToEdit!: IProduct;

  productForm = new FormGroup<ProductForm>({
    id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.minLength(2), Validators.maxLength(50)],
    }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.minLength(2), Validators.maxLength(30)],
    }),
    quantity: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required]),
  });

  constructor(
    private modalCtrl: ModalController,
    private productsService: ProductsService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit(): void {
    // TODO: create lo populate form if it informed in productToEdit
  }

  cancel() {
    return this.modalCtrl.dismiss(false);
  }

  async handleSubmit() {
    const productInfo = this.buildProduct();
    const load = await this.showLoading('Saving new product...');

    if (productInfo) {
      this.productsService
        .newProduct(productInfo)
        .pipe(finalize(() => load.dismiss()))
        .subscribe((productCreated) => {
          return this.modalCtrl.dismiss(productCreated);
        });
    }
  }

  private buildProduct() {
    const { name, description, quantity, price } = this.productForm.value ?? {};
    if (name && description && quantity && price) {
      const product = new Product(name, description, quantity, price);
      return product;
    }

    return false;
  }

  private async showLoading(message: string): Promise<HTMLIonLoadingElement> {
    const load = await this.loadingCtrl.create({
      message: message,
    });
    load.present();
    return load;
  }

  showCharRemainingCounter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} characters remaining`;
  }
}
