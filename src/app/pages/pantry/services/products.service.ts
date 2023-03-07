import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { IProduct } from './../models/product';

@Injectable()
export class ProductsService {
  private baseUrl = `${environment.baseURL}pantry/products`;

  constructor(private httpClient: HttpClient) {}

  getProducts(): Observable<IProduct[]> {
    return this.httpClient.get<IProduct[]>(this.baseUrl);
  }

  newProduct(newProduct: IProduct): Observable<IProduct> {
    return this.httpClient.post<IProduct>(this.baseUrl, { newProduct });
  }
}
