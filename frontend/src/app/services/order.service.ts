import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CreateOrderRequest {
  userID: number;
  note?: string;
  items: { productId: number; quantity: number }[];
}

export interface CreateOrderResponse {
  success: boolean;
  orderID: number;
  totalAmount: number;
  errorMessage?: string;
}

export interface OrderDetail {
  orderID: number;
  status: string;
  totalAmount: number;
  expiredAt: string;
  createdAt: string;
  items: OrderItemDetail[];
}

export interface OrderItemDetail {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  discountPrice?: number;
  subtotal: number;
}

export interface OrderStatus {
  orderID: number;
  status: string;
  paidAt?: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiUrl}/api/Order`;

  constructor(private http: HttpClient) {}

  createOrder(request: CreateOrderRequest): Observable<CreateOrderResponse> {
    return this.http.post<CreateOrderResponse>(`${this.apiUrl}/create`, request);
  }

  getOrderDetail(orderId: number): Observable<OrderDetail> {
    return this.http.get<OrderDetail>(`${this.apiUrl}/${orderId}`);
  }

  getOrderStatus(orderId: number): Observable<OrderStatus> {
    return this.http.get<OrderStatus>(`${this.apiUrl}/${orderId}/status`);
  }
}
