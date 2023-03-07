import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalController, IonicModule } from '@ionic/angular';
import { IProduct, Product } from '../../models/product';

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

  constructor(private modalCtrl: ModalController) {}

  ngOnInit(): void {
    // TODO: create lo populate form if it informed in productToEdit
  }

  cancel() {
    return this.modalCtrl.dismiss(false);
  }

  confirm() {
    const productInfo = this.buildProduct();
    return this.modalCtrl.dismiss(productInfo);
  }

  showCharRemainingCounter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} characters remaining`;
  }

  private buildProduct() {
    const { name, description, quantity, price } = this.productForm.value ?? {};
    if (name && description && quantity && price) {
      const product = new Product(name, description, quantity, price);
      return product;
    }

    return false;
  }
}
