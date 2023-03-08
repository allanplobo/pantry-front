import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { IProduct } from '../models/product';

import { ProductsService } from './products.service';

const mockProducts: IProduct[] = [
  {
    id: '1',
    name: 'Product 1',
    description: 'Product 1 description',
    quantity: 10,
    price: 20,
  },
  { id: '2', name: 'Product 2', quantity: 5, price: 10 },
];

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, IonicModule],
      providers: [ProductsService],
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // TODO: Create error cases after implement the handleError logic

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve products from the API via GET', () => {
    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const mockReq = httpMock.expectOne(`${environment.baseURL}pantry/products`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush(mockProducts);
  });

  it('should add a new product via POST', () => {
    const newProduct: IProduct = {
      name: 'New Product',
      description: 'New Product description',
      quantity: 10,
      price: 20,
    };

    const mockProduct: IProduct = {
      id: '3',
      name: 'New Product',
      description: 'New Product description',
      quantity: 10,
      price: 20,
    };

    service.newProduct(newProduct).subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${environment.baseURL}pantry/products`);
    expect(req.request.method).toEqual('POST');
    req.flush(mockProduct);
  });
});
