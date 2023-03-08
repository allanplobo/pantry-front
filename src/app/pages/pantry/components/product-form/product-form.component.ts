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
import { FeedbackService } from './../../../../services/feedback.service';
import { ProductsService } from './../../services/products.service';

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
    private feedbackService: FeedbackService
  ) {}

  ngOnInit(): void {
    // TODO: create lo populate form if it informed in productToEdit
  }

  cancel() {
    return this.modalCtrl.dismiss(false);
  }

  async handleSubmit() {
    const productInfo = this.buildProduct();
    const load = await this.feedbackService.showLoading(
      'Saving new product...'
    );

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

  showCharRemainingCounter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} characters remaining`;
  }
}
