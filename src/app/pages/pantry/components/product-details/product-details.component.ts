import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { IProduct, Product } from '../../models/product';
import { FeedbackService } from '../../../../services/feedback.service';
import { ProductsService } from '../../services/products.service';

interface ProductForm {
  name: FormControl<string>;
  description?: FormControl<string>;
  quantity: FormControl<number | null>;
  price: FormControl<number | null>;
}

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, IonicModule],
  providers: [ProductsService],
})
export class ProductDetailsComponent implements OnInit {
  productInfo!: IProduct;
  enableProductForm!: boolean;

  productForm = new FormGroup<ProductForm>({
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(100)],
    }),
    quantity: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required]),
  });

  constructor(
    private modalCtrl: ModalController,
    private productsService: ProductsService,
    private feedbackService: FeedbackService
  ) {}

  ngOnInit(): void {
    if (this.productInfo) {
      this.populateForm();
    }
  }

  populateForm() {
    Object.keys(this.productInfo).forEach((key) => {
      if (this.productForm.get(key) && key !== '_id') {
        this.productForm
          .get(key)
          ?.patchValue(this.productInfo[key as keyof IProduct], {
            emitEvent: false,
          });
      }
    });

    if (!this.enableProductForm) {
      this.productForm.disable();
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(false);
  }

  handleSubmit() {
    if (!this.productInfo) {
      this.createProduct();
      return;
    }

    if (!this.enableProductForm) {
      this.productForm.enable();
      this.enableProductForm = !this.enableProductForm;
      return;
    }

    this.editProduct();
  }

  private async createProduct() {
    const productData = this.buildProduct();
    const load = await this.feedbackService.showLoading(
      'Saving new product...'
    );

    if (productData) {
      this.productsService
        .newProduct(productData)
        .pipe(finalize(() => load.dismiss()))
        .subscribe((productCreated) => {
          return this.modalCtrl.dismiss(productCreated);
        });
    }
  }

  private async editProduct() {
    const productData = this.buildProduct();
    const load = await this.feedbackService.showLoading('Editing product...');

    if (productData) {
      this.productsService
        .editProduct(this.productInfo._id || '', productData)
        .pipe(finalize(() => load.dismiss()))
        .subscribe((productCreated) => {
          return this.modalCtrl.dismiss(productCreated);
        });
    }
  }

  private buildProduct() {
    const { name, description, quantity, price } = this.productForm.value ?? {};

    const product = new Product(
      name || '',
      description || '',
      quantity || 0,
      price || 0
    );
    return product;
  }

  showCharRemainingCounter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} characters remaining`;
  }
}
