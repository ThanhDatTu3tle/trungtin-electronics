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
    const payload = {
      categoryId: data.categoryId,
      productName: data.productName,
      description: data.description ?? null,
      price: data.price,
      imageUrl: data.imageUrl ?? null,
      code: data.code ?? null,
      discountPrice: data.discountPrice ?? null,
      currency: data.currency ?? 'VND',
      brand: data.brand ?? null,
      stock: data.stock ?? 0,
      isNew: data.isNew ?? false,
      isFeatured: data.isFeatured ?? false,
      isSpotlight: data.isSpotlight ?? false
    };

    return this.http.post<CreateProductResponse>(
      this.apiUrl + '/CreateProduct',
      payload, // ✅ gửi JSON body
      { headers: this.getAuthHeaders() }
    );
  }

  getProductsByEvent(eventId: number) {
    return this.http.post(`${this.apiUrl}/Products/GetAllProducts?eventId=${eventId}`, {});
  }
}
