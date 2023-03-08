import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { IProduct } from '../models/product';
import { NotificationsService } from './../../../services/notifications.service';

import { ProductsService } from './products.service';

const notificationsServiceMock = {
  showToast: jasmine.createSpy('showToast'),
};

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
  let httpClientSpy: { get: jasmine.Spy };
  let service: ProductsService;
  let httpMock: HttpTestingController;
  let notificationsService: NotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, IonicModule],
      providers: [
        ProductsService,
        { provide: NotificationsService, useValue: notificationsServiceMock },
      ],
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
    notificationsService = TestBed.inject(NotificationsService);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
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

    const mockReq = httpMock.expectOne(service['baseUrl']);
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

    const req = httpMock.expectOne(service['baseUrl']);
    expect(req.request.method).toEqual('POST');
    req.flush(mockProduct);
  });

  it('should call the showToast method of the notifications service with the correct parameters', () => {
    const errorMessage = 'An error occurred';
    service['handleError'](errorMessage);
    expect(notificationsServiceMock.showToast).toHaveBeenCalledWith(
      errorMessage,
      'danger'
    );
  });

  it('should call the showToast method of the notifications service with the default error message and the correct parameters', () => {
    service['handleError']('');
    expect(notificationsServiceMock.showToast).toHaveBeenCalledWith(
      'Something went wrong! Please, try again!',
      'danger'
    );
  });
});
