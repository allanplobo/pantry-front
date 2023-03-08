import { NotificationsService } from './../../../services/notifications.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { IProduct } from './../models/product';

@Injectable()
export class ProductsService {
  private baseUrl = `${environment.baseURL}pantry/products`;

  constructor(
    private httpClient: HttpClient,
    private notificationsService: NotificationsService
  ) {}

  getProducts(): Observable<IProduct[]> {
    return this.httpClient.get<IProduct[]>(this.baseUrl);
  }

  newProduct(product: IProduct): Observable<IProduct> {
    return this.httpClient.post<IProduct>(this.baseUrl, product).pipe(
      catchError((error) => {
        const { message } = error.error;
        this.handleError(message);
        throw error;
      })
    );
  }

  private handleError(errorMessage: string) {
    this.notificationsService.showToast(
      errorMessage || 'Something went wrong! Please, try again!',
      'danger'
    );
  }
}
