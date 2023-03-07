import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';

import { ProductsService } from './products.service';

const mockProducts: Product[] = [
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
      imports: [HttpClientTestingModule],
      providers: [ProductsService],
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

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
});
