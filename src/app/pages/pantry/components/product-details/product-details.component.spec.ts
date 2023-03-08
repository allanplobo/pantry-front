import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductsService } from '../../services/products.service';
import { ProductDetailsComponent } from './product-details.component';

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

  describe('form validation', () => {
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
