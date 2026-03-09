import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

// Services
import { WishlistService, WishlistItem } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

// PrimeNG
import { MenuItem, ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-wishlist-page',
  templateUrl: './wishlist-page.html',
  styleUrl: './wishlist-page.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbModule,
    ButtonModule,
    DividerModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class WishlistPage implements OnInit {
  wishlistItems$!: Observable<WishlistItem[]>;
  wishlistCount$!: Observable<number>;
  
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
  breadcrumbItems: MenuItem[] = [
    { label: 'Danh sách yêu thích' }
  ];

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.wishlistItems$ = this.wishlistService.wishlistItems$;
    this.wishlistCount$ = this.wishlistService.wishlistCount$;
  }

  /**
   * Remove item from wishlist
   */
  removeItem(productId: number): void {
    this.wishlistService.removeFromWishlist(productId);
    this.messageService.add({
      severity: 'success',
      summary: 'Đã xóa',
      detail: 'Sản phẩm đã được xóa khỏi danh sách yêu thích'
    });
  }

  /**
   * Clear all items from wishlist
   */
  clearWishlist(): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi danh sách yêu thích?',
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa tất cả',
      rejectLabel: 'Hủy',
      accept: () => {
        this.wishlistService.clearWishlist();
        this.messageService.add({
          severity: 'success',
          summary: 'Đã xóa',
          detail: 'Danh sách yêu thích đã được xóa'
        });
      }
    });
  }

  /**
   * Add item to cart
   */
  addToCart(item: WishlistItem): void {
    this.cartService.addToCart(item);
    this.messageService.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Đã thêm sản phẩm vào giỏ hàng'
    });
  }

  /**
   * Navigate to product detail
   */
  viewProduct(code: string, name: string): void {
    this.router.navigate(['/detail-product', code, name]);
  }

  /**
   * Continue shopping
   */
  continueShopping(): void {
    this.router.navigate(['/']);
  }
}
