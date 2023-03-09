import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IProduct } from '../../models/product';
import { ProductsService } from '../../services/products.service';
import { ProductDetailsComponent } from './product-details.component';

// TODO: write unit tests

const productMock: IProduct = {
  _id: '1',
  name: 'test',
  description: 'description',
  quantity: 1,
  price: 1,
};

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule,
        ProductDetailsComponent,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: ProductsService, useValue: productsServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('forms and validators', () => {
    it('should not populate form on init when component have productInfo', () => {
      const populateFormSpy = spyOn(component, 'populateForm');
      component.ngOnInit();
      expect(populateFormSpy).not.toHaveBeenCalled();
    });

    it('should populate form on init when component have productInfo', () => {
      component.productInfo = productMock;
      component.ngOnInit();
      expect(component.productForm.get('name')?.value).toEqual(
        productMock.name
      );
      expect(component.productForm.get('description')?.value).toEqual(
        productMock.description
      );
      expect(component.productForm.get('quantity')?.value).toEqual(
        productMock.quantity
      );
      expect(component.productForm.get('price')?.value).toEqual(
        productMock.price
      );
      expect(component.productForm.disabled).toBeTrue();
    });

    it('should not disable form if enableProductForm is true', () => {
      component.productInfo = productMock;
      component.enableProductForm = true;
      component.ngOnInit();
      expect(component.productForm.disabled).toBeFalse();
    });

    it('should be invalid when name is not provided', () => {
      const form = component.productForm;
      form.patchValue({ description: 'test', quantity: 1, price: 2 });
      expect(form.valid).toBeFalsy();
      expect(form.get('name')?.errors?.['required']).toBeTruthy();
    });

    it('should be invalid when name is too short', () => {
      const form = component.productForm;
      form.patchValue({
        name: 'a',
        description: 'test',
        quantity: 1,
        price: 2,
      });
      expect(form.valid).toBeFalsy();
      expect(form.get('name')?.errors?.['minlength']).toBeTruthy();
    });

    it('should be invalid when name is too long', () => {
      const form = component.productForm;
      const name = 'a'.repeat(101);
      form.patchValue({ name, description: 'test', quantity: 1, price: 2 });
      expect(form.valid).toBeFalsy();
      expect(form.get('name')?.errors?.['maxlength']).toBeTruthy();
    });

    it('should be valid when all fields are provided', () => {
      const form = component.productForm;
      form.patchValue({
        name: 'test',
        description: 'test',
        quantity: 1,
        price: 2,
      });
      expect(form.valid).toBeTruthy();
    });
  });
});
