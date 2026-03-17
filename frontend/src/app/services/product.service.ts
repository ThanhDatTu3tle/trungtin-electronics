import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

interface ApiResponse<T> {
  message: string;
  result: number;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/Products`;

  constructor(private http: HttpClient) {}

  getAllProducts(
    code?: string,
    categoryId?: string,
    brand?: string,
    minPrice?: number,
    maxPrice?: number,
    isNew?: boolean,
    isFeatured?: boolean,
    isSpotlight?: boolean
  ): Observable<Product[]> {
    let params = new HttpParams();
    if (code) params = params.set('code', code);
    if (categoryId) params = params.set('categoryId', categoryId);
    if (brand) params = params.set('brand', brand);
    if (minPrice != null) params = params.set('minPrice', minPrice);
    if (maxPrice != null) params = params.set('maxPrice', maxPrice);
    if (isNew) params = params.set('isNew', '1');
    if (isFeatured) params = params.set('isFeatured', '1');
    if (isSpotlight) params = params.set('isSpotlight', '1');

    return this.http
      .post<ApiResponse<Product[]>>(this.apiUrl + '/GetAllProducts', {}, { params })
      .pipe(map((response) => response.data));
  }

  getProductByCode(code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/GetProductByCode?code=${code}`, {});
  }

  createProduct() {
    
  }

  getProductsByEvent(eventId: number) {
    return this.http.post(`${this.apiUrl}/Products/GetAllProducts?eventId=${eventId}`, {});
  }
}
