import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

interface ApiResponse<T> {
  message: string;
  result: number;
  data: T;
}

export interface CreateProductRequest {
  categoryId: string;
  productName: string;
  description?: string;
  price: number;
  imageUrl?: string;
  code?: string;
  discountPrice?: number;
  currency?: string;
  brand?: string;
  stock?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isSpotlight?: boolean;
}

export interface CreateProductResponse {
  message: string;
  result: number;
  productId: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/Products`;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // đổi key nếu lưu tên khác
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

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

  createProduct(data: CreateProductRequest): Observable<CreateProductResponse> {
    let params = new HttpParams()
      .set('categoryId', data.categoryId)
      .set('productName', data.productName)
      .set('price', data.price.toString())
      .set('stock', (data.stock ?? 0).toString())
      .set('isNew', (data.isNew ?? false).toString())
      .set('isFeatured', (data.isFeatured ?? false).toString())
      .set('isSpotlight', (data.isSpotlight ?? false).toString());

    // Các field optional - chỉ append nếu có giá trị
    if (data.description) params = params.set('description', data.description);
    if (data.imageUrl) params = params.set('imageUrl', data.imageUrl);
    if (data.code) params = params.set('code', data.code);
    if (data.discountPrice) params = params.set('discountPrice', data.discountPrice.toString());
    if (data.currency) params = params.set('currency', data.currency);
    if (data.brand) params = params.set('brand', data.brand);

    return this.http.post<CreateProductResponse>(
      this.apiUrl,
      null, // body null vì BE dùng [FromQuery]
      {
        headers: this.getAuthHeaders(),
        params
      }
    );
  }

  getProductsByEvent(eventId: number) {
    return this.http.post(`${this.apiUrl}/Products/GetAllProducts?eventId=${eventId}`, {});
  }
}
