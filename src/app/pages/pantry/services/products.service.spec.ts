import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { IProduct, Product } from '../models/product';
import { FeedbackService } from '../../../services/feedback.service';

import { ProductsService } from './products.service';

// TODO: improve unit tests

const notificationsServiceMock = {
  showToast: jasmine.createSpy('showToast'),
};

const mockProducts: IProduct[] = [
  {
    _id: '1',
    name: 'Product 1',
    description: 'Product 1 description',
    quantity: 10,
    price: 20,
  },
  { _id: '2', name: 'Product 2', quantity: 5, price: 10 },
];

describe('ProductsService', () => {
  let httpClientSpy: { get: jasmine.Spy };
  let service: ProductsService;
  let httpMock: HttpTestingController;
  let feedbackService: FeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, IonicModule],
      providers: [
        ProductsService,
        { provide: FeedbackService, useValue: notificationsServiceMock },
      ],
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
    feedbackService = TestBed.inject(FeedbackService);
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
    const newProduct = new Product(
      'New Product',
      'New Product description',
      10,
      20
    );

    const mockProduct: IProduct = {
      _id: '3',
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
