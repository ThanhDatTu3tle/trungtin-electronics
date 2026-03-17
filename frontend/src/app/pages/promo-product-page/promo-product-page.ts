import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

// Services
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

// Components
import { ProductCard } from '../../components/product-card/product-card';

@Component({
  selector: 'app-promo-product-page',
  standalone: true,
  imports: [CommonModule, ButtonModule, BreadcrumbModule, ProductCard],
  templateUrl: './promo-product-page.html',
  styleUrl: './promo-product-page.scss'
})
export class PromoProductPage implements OnInit {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  promoProducts: any[] = [];
  isLoading = true;

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    this.items = [{ label: 'Khuyến mãi' }];

    this.loadPromoProducts();
  }

  loadPromoProducts() {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (data: any) => {
        // Lọc sản phẩm có discountPrice > 0
        this.promoProducts = data.filter((p: any) => p.discountPrice && p.discountPrice > 0);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading promo products', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleWishlist(product: any) {
    if (this.wishlistService.isInWishlist(product.productId)) {
      this.wishlistService.removeFromWishlist(product.productId);
    } else {
      this.wishlistService.addToWishlist(product);
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }

  addCart(product: any) {
    this.cartService.addToCart(product, 1);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
