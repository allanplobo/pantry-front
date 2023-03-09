import { FeedbackService } from '../../../services/feedback.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { IProduct, Product } from './../models/product';

@Injectable()
export class ProductsService {
  private baseUrl = `${environment.baseURL}pantry/products`;

  constructor(
    private httpClient: HttpClient,
    private feedbackService: FeedbackService
  ) {}

  getProducts(): Observable<IProduct[]> {
    return this.httpClient.get<IProduct[]>(this.baseUrl).pipe(
      catchError((error) => {
        const { message } = error.error;
        this.handleError(message);
        throw error;
      })
    );
  }

  searchProductByName(productName: string): Observable<IProduct[]> {
    return this.httpClient
      .get<IProduct[]>(`${this.baseUrl}/${productName}`)
      .pipe(
        catchError((error) => {
          const { message } = error.error;
          this.handleError(message);
          throw error;
        })
      );
  }

  newProduct(product: Product): Observable<IProduct> {
    return this.httpClient.post<IProduct>(this.baseUrl, product).pipe(
      catchError((error) => {
        const { message } = error.error;
        this.handleError(message);
        throw error;
      })
    );
  }

  editProduct(productId: string, product: Product): Observable<IProduct> {
    return this.httpClient
      .put<IProduct>(`${this.baseUrl}/${productId}`, product)
      .pipe(
        catchError((error) => {
          const { message } = error.error;
          this.handleError(message);
          throw error;
        })
      );
  }

  deleteProduct(productId: string): Observable<{ message: string }> {
    return this.httpClient
      .delete<{ message: string }>(`${this.baseUrl}/${productId}`)
      .pipe(
        catchError((error) => {
          const { message } = error.error;
          this.handleError(message);
          throw error;
        })
      );
  }

  private handleError(errorMessage: string) {
    this.feedbackService.showToast(
      errorMessage || 'Something went wrong! Please, try again!',
      'danger'
    );
  }
}
