import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FeedbackService } from '../../../services/feedback.service';
import { IProduct, Product } from '../models/product';

import { ProductsService } from './products.service';

const feedbackServiceMock = {
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

const newProduct = new Product(
  'New Product',
  'New Product description',
  10,
  20
);

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;
  let feedbackService: FeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, IonicModule],
      providers: [
        ProductsService,
        { provide: FeedbackService, useValue: feedbackServiceMock },
      ],
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
    feedbackService = TestBed.inject(FeedbackService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('GET operations', () => {
    it('should retrieve products from the API via GET', () => {
      service.getProducts().subscribe((products) => {
        expect(products.length).toBe(2);
        expect(products).toEqual(mockProducts);
      });

      const mockReq = httpMock.expectOne(service['baseUrl']);
      expect(mockReq.request.method).toBe('GET');
      mockReq.flush(mockProducts);
    });

    it('should handle errors when getting products', () => {
      service.getProducts().subscribe({
        error: () => {
          expect(feedbackService.showToast).toHaveBeenCalledWith(
            'Something went wrong! Please, try again!',
            'danger'
          );
        },
      });

      const mockReq = httpMock.expectOne(service['baseUrl']);
      expect(mockReq.request.method).toBe('GET');
      mockReq.flush(
        {},
        {
          status: 500,
          statusText: 'Internal Server Error',
        }
      );
    });

    it('should retrieve a product by name from the API via GET', () => {
      const productName = 'Product 1';

      service.searchProductByName(productName).subscribe((product) => {
        expect(product.length).toBe(1);
        expect(product[0].name).toBe(productName);
      });

      const mockReq = httpMock.expectOne(
        `${service['baseUrl']}/${productName}`
      );
      expect(mockReq.request.method).toBe('GET');
      mockReq.flush([mockProducts[0]]);
    });

    it('should handle errors when searching products by name', () => {
      const productName = 'Test Product';

      service.searchProductByName(productName).subscribe({
        error: () => {
          expect(feedbackService.showToast).toHaveBeenCalledWith(
            'Something went wrong! Please, try again!',
            'danger'
          );
        },
      });

      const mockReq = httpMock.expectOne(
        `${service['baseUrl']}/${productName}`
      );
      expect(mockReq.request.method).toBe('GET');
      mockReq.flush(
        {},
        {
          status: 500,
          statusText: 'Internal Server Error',
        }
      );
    });
  });

  describe('POST operations', () => {
    it('should add a new product via POST', () => {
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

    it('should handle errors when adding a new product', () => {
      service.newProduct(newProduct).subscribe({
        error: () => {
          expect(feedbackService.showToast).toHaveBeenCalledWith(
            'Something went wrong! Please, try again!',
            'danger'
          );
        },
      });

      const mockReq = httpMock.expectOne(service['baseUrl']);
      expect(mockReq.request.method).toBe('POST');
      mockReq.flush(
        {},
        {
          status: 500,
          statusText: 'Internal Server Error',
        }
      );
    });
  });

  describe('PUT operations', () => {
    it('should edit an existing product via PUT', () => {
      const productId = '1';
      const editedProduct = new Product(
        'Edited Product',
        'Edited Product description',
        5,
        15
      );

      const mockEditedProduct: IProduct = {
        _id: productId,
        name: 'Edited Product',
        description: 'Edited Product description',
        quantity: 5,
        price: 15,
      };

      service.editProduct(productId, editedProduct).subscribe((product) => {
        expect(product).toEqual(mockEditedProduct);
      });

      const req = httpMock.expectOne(`${service['baseUrl']}/${productId}`);
      expect(req.request.method).toEqual('PUT');
      req.flush(mockEditedProduct);
    });

    it('should handle errors when editing products', () => {
      service.editProduct('1', newProduct).subscribe({
        error: () => {
          expect(feedbackService.showToast).toHaveBeenCalledWith(
            'Something went wrong! Please, try again!',
            'danger'
          );
        },
      });

      const mockReq = httpMock.expectOne(`${service['baseUrl']}/1`);
      expect(mockReq.request.method).toBe('PUT');
      mockReq.flush(
        {},
        {
          status: 500,
          statusText: 'Internal Server Error',
        }
      );
    });
  });

  describe('DELETE operations', () => {
    it('should delete an existing product via DELETE', () => {
      const productId = '1';

      service.deleteProduct(productId).subscribe((response) => {
        expect(response.message).toBe('Product deleted');
      });

      const req = httpMock.expectOne(`${service['baseUrl']}/${productId}`);
      expect(req.request.method).toEqual('DELETE');
      req.flush({ message: 'Product deleted' });
    });

    it('should handle errors when deleting a new product', () => {
      service.deleteProduct('1').subscribe({
        error: () => {
          expect(feedbackService.showToast).toHaveBeenCalledWith(
            'Something went wrong! Please, try again!',
            'danger'
          );
        },
      });

      const mockReq = httpMock.expectOne(`${service['baseUrl']}/1`);
      expect(mockReq.request.method).toBe('DELETE');
      mockReq.flush(
        {},
        {
          status: 500,
          statusText: 'Internal Server Error',
        }
      );
    });
  });

  describe('Calling FeedbackService', () => {
    it('should call the showToast method of the notifications service with the correct parameters', () => {
      const errorMessage = 'An error occurred';
      service['handleError'](errorMessage);
      expect(feedbackServiceMock.showToast).toHaveBeenCalledWith(
        errorMessage,
        'danger'
      );
    });

    it('should call the showToast method of the notifications service with the default error message and the correct parameters', () => {
      service['handleError']('');
      expect(feedbackServiceMock.showToast).toHaveBeenCalledWith(
        'Something went wrong! Please, try again!',
        'danger'
      );
    });
  });
});
