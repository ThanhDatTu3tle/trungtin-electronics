import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TagModule } from 'primeng/tag';
import { MenuItem } from 'primeng/api';

// Services
import { ProductService } from '../../services/product.service';
import { EventService } from '../../services/event.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

// Components
import { ProductCard } from '../../components/product-card/product-card';

@Component({
  selector: 'app-promo-product-page',
  standalone: true,
  imports: [CommonModule, ButtonModule, BreadcrumbModule, TagModule, ProductCard],
  templateUrl: './promo-product-page.html',
  styleUrl: './promo-product-page.scss'
})
export class PromoProductPage implements OnInit {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  promoProducts: any[] = [];
  activeEvents: any[] = [];
  selectedEvent: any = null;
  isLoading = true;

  constructor(
    private productService: ProductService,
    private eventService: EventService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    this.items = [{ label: 'Khuyến mãi' }];
    this.loadActiveEvents();
  }

  loadActiveEvents() {
    this.eventService.getActiveEvents().subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res : res.data || [];
        this.activeEvents = data;

        // Lấy eventId từ query param nếu có, không thì lấy event đầu tiên
        const eventId = this.route.snapshot.queryParams['eventId'];
        if (eventId) {
          this.selectedEvent = this.activeEvents.find(e => e.eventId == eventId) || this.activeEvents[0];
        } else {
          this.selectedEvent = this.activeEvents[0] || null;
        }

        if (this.selectedEvent) {
          this.loadPromoProducts(this.selectedEvent.eventId);
        } else {
          // Không có event nào → lọc theo discountPrice
          this.loadDiscountProducts();
        }
      },
      error: () => this.loadDiscountProducts()
    });
  }

  loadPromoProducts(eventId: number) {
    this.isLoading = true;
    this.productService.getProductsByEvent(eventId).subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res : res.data || [];
        this.promoProducts = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadDiscountProducts() {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res : res.data || [];
        this.promoProducts = data.filter((p: any) => p.discountPrice && p.discountPrice > 0);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  selectEvent(event: any) {
    this.selectedEvent = event;
    this.loadPromoProducts(event.eventId);
  }

  get bannerBackground(): string {
    if (this.selectedEvent?.colorTheme) {
      return `linear-gradient(135deg, ${this.selectedEvent.colorTheme} 0%, ${this.selectedEvent.colorTheme}99 100%)`;
    }
    return 'linear-gradient(135deg, #0e5b3f 0%, #17835c 100%)';
  }

  get daysLeft(): number {
    if (!this.selectedEvent?.endDate) return 0;
    const diff = new Date(this.selectedEvent.endDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
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
