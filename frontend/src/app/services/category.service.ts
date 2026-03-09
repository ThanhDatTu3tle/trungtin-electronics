import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/Categories`;

  constructor(private http: HttpClient) {}

  // Lấy tất cả
  getAllCategories(
    categoryName?: string
  ): Observable<Category[]> {
    return this.http.post<Category[]>(this.apiUrl + '/getAllCategories', {
      categoryName
    });
  }

  // Tạo mới
  createCategory(
    categoryName?: string,
    description?: string,
    key?: string,
    icon?: string,
    status?: number
  ): Observable<Category[]>  {
    return this.http.post<Category[]>(this.apiUrl + '/createCategory', {
      categoryName, description, key, icon, status
    });
  }

  // Cập nhật, Xóa, Khôi phục
  updateCategory(
    categoryId?: number,
    categoryName?: string,
    description?: string,
    key?: string,
    icon?: string,
    action?: string
  ): Observable<Category[]>  {
    return this.http.post<Category[]>(this.apiUrl + '/UpdateCategory', {
      categoryId, categoryName, description, key, icon, action
    });
  }
}
