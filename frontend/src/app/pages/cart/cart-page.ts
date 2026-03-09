import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

// Services
import { CartService, CartItem } from '../../services/cart.service';

// PrimeNG
import { MenuItem, ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    BreadcrumbModule,
    ButtonModule,
    InputNumberModule,
    DividerModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class CartPage implements OnInit {
  cartItems$!: Observable<CartItem[]>;
  cartCount$!: Observable<number>;
  
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
  breadcrumbItems: MenuItem[] = [
    { label: 'Giỏ hàng' }
  ];

  constructor(
    private cartService: CartService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cartItems$ = this.cartService.cartItems$;
    this.cartCount$ = this.cartService.cartCount$;
  }

  /**
   * Get cart items synchronously for template
   */
  getCartItems(): CartItem[] {
    return this.cartService.getCartItems();
  }

  /**
   * Update item quantity
   */
  updateQuantity(productId: number, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeItem(productId);
      return;
    }
    
    this.cartService.updateQuantity(productId, newQuantity);
  }

  /**
   * Increment item quantity
   */
  incrementQuantity(item: CartItem): void {
    if (item.quantity < item.stock) {
      this.cartService.updateQuantity(item.productId, item.quantity + 1);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Đã đạt số lượng tối đa trong kho'
      });
    }
  }

  /**
   * Decrement item quantity
   */
  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.productId, item.quantity - 1);
    } else {
      this.removeItem(item.productId);
    }
  }

  /**
   * Remove item from cart
   */
  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.messageService.add({
      severity: 'success',
      summary: 'Đã xóa',
      detail: 'Sản phẩm đã được xóa khỏi giỏ hàng'
    });
  }

  /**
   * Clear all items from cart
   */
  clearCart(): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?',
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa tất cả',
      rejectLabel: 'Hủy',
      accept: () => {
        this.cartService.clearCart();
        this.messageService.add({
          severity: 'success',
          summary: 'Đã xóa',
          detail: 'Giỏ hàng đã được xóa'
        });
      }
    });
  }

  /**
   * Calculate total price
   */
  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  /**
   * Get item subtotal
   */
  getItemSubtotal(item: CartItem): number {
    const price = item.discountPrice || item.price;
    return price * item.quantity;
  }

  /**
   * Continue shopping
   */
  continueShopping(): void {
    this.router.navigate(['/']);
  }

  /**
   * Proceed to checkout
   */
  proceedToCheckout(): void {
    // TODO: Implement checkout page
    this.messageService.add({
      severity: 'info',
      summary: 'Thông báo',
      detail: 'Chức năng thanh toán đang được phát triển'
    });
  }

  /**
   * Navigate to product detail
   */
  viewProduct(code: string, name: string): void {
    this.router.navigate(['/detail-product', code, name]);
  }
}
