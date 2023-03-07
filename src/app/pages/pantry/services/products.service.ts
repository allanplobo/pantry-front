import { environment } from './../../../../environments/environment';
import { Product } from './../models/product';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProductsService {
  private baseUrl = `${environment.baseURL}pantry/products`;

  constructor(private httpClient: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.baseUrl);
  }
}
