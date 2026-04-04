import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CartService, CartItem } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TextareaModule,
    DividerModule,
    ToastModule,
    BreadcrumbModule,
  ],
  providers: [MessageService],
})
export class CheckoutPage implements OnInit {
  cartItems: CartItem[] = [];
  note: string = '';
  isLoading: boolean = false;

  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
  breadcrumbItems: MenuItem[] = [
    { label: 'Giỏ hàng', routerLink: '/cart' },
    { label: 'Xác nhận đơn hàng' },
  ];

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
    }
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  getItemSubtotal(item: CartItem): number {
    return (item.discountPrice || item.price) * item.quantity;
  }

  placeOrder(): void {
    const user = this.authService.getUserInfo();
    if (!user) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Chưa đăng nhập',
        detail: 'Vui lòng đăng nhập để đặt hàng',
      });
      this.router.navigate(['/login']);
      return;
    }

    // Lấy userId từ JWT claim
    const userId = Number(
      user[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ],
    );

    this.isLoading = true;

    const request = {
      userID: userId,
      note: this.note,
      items: this.cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    this.orderService.createOrder(request).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.cartService.clearCart();
          this.router.navigate(['/invoice', res.orderID]);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: res.errorMessage || 'Đặt hàng thất bại',
          });
        }
      },
      error: () => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể kết nối server',
        });
      },
    });
  }
}
