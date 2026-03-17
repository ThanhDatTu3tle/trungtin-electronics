import { Component, ChangeDetectorRef, HostListener, OnDestroy  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Thư viện Primeng
import { Tooltip } from 'primeng/tooltip';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';

// Services
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { EventService } from '../../services/event.service';

// Components
import { Carousel } from './carousel/carousel';
import { ProductCard } from '../../components/product-card/product-card';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  standalone: true,
  imports: [CommonModule, Tooltip, Carousel, ProductCard, CarouselModule, ButtonModule],
})
export class HomePage implements OnDestroy {
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private wishlistService: WishlistService,
    private eventService: EventService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDataCategory();
    this.loadDataProduct();
    this.loadActiveEvents();
  }

  ngOnDestroy() {
    // Clear auto-swap interval khi component bị destroy
    if (this.spotlightInterval) {
      clearInterval(this.spotlightInterval);
    }
  }

  screenWidth = window.innerWidth;
  @HostListener('window:resize', [])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  active = '';
  categories: any = [];
  loadDataCategory() {
    this.categoryService.getAllCategories().subscribe((response: any) => {
      // Handle both wrapped and direct array responses
      const data = Array.isArray(response) ? response : response.data;
      this.categories = data || [];
      this.cdr.detectChanges();
    });
  }

  isProductLoaded: boolean = false;
  skeletonItems = new Array(6);
  productListNew: any = [];
  productListOutstanding: any = [];
  productListDiscount: any = []; // Sản phẩm khuyến mãi
  spotlightProducts: any[] = []; // Sản phẩm spotlight

  // Spotlight auto-swap
  activeSpotlightIndex: number = 0;
  private spotlightInterval: any = null;

  spotlightResponsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  get numVisibleSpotlight(): number {
    if (this.screenWidth >= 1024) return 4;
    if (this.screenWidth >= 768) return 3;
    return 1;
  }

  get isDesktop(): boolean {
    return this.screenWidth >= 1024;
  }

  startSpotlightAutoSwap() {
    if (this.spotlightInterval) {
      clearInterval(this.spotlightInterval);
    }
    if (this.spotlightProducts.length > 1) {
      this.spotlightInterval = setInterval(() => {
        this.activeSpotlightIndex =
          (this.activeSpotlightIndex + 1) % this.spotlightProducts.length;
        this.cdr.detectChanges();
      }, 3000);
    }
  }

  get activeSpotlightProduct(): any {
    return this.spotlightProducts[this.activeSpotlightIndex] || null;
  }

  goToSpotlight(index: number) {
    this.activeSpotlightIndex = index;
    // Reset timer khi user click manual
    this.startSpotlightAutoSwap();
  }

  loadDataProduct() {
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        // Handle both wrapped and direct array responses
        const data = Array.isArray(response) ? response : response.data;
        
        if (data) {
          // lọc & sort theo CreatedDate giảm dần
          const newProducts = data
            .filter((item: any) => item.isNew)
            .sort((a: any, b: any) => {
              const dateDiff = new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
              return dateDiff !== 0 ? dateDiff : b.productId - a.productId;
            });

          const featuredProducts = data.filter((item: any) => item.isFeatured);

          // Lọc sản phẩm có khuyến mãi (discountPrice > 0)
          const discountProducts = data.filter((item: any) => item.discountPrice && item.discountPrice > 0);

          // Lọc sản phẩm spotlight
          const spotlightItems = data.filter((item: any) => item.isSpotlight);

          let limit = 4;
          if (this.screenWidth >= 768 && this.screenWidth < 1024) limit = 3;

          this.productListNew = newProducts.slice(0, limit);
          this.productListOutstanding = featuredProducts;
          this.productListDiscount = discountProducts.slice(0, limit);
          this.spotlightProducts = spotlightItems;

          // Bắt đầu auto-swap cho desktop spotlight
          this.startSpotlightAutoSwap();
          
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error loading products', err);
      },
      complete: () => {
        this.isProductLoaded = true;
        this.cdr.detectChanges();
      }
    });
  }

  // Thêm biến
  activeEvents: any[] = [];
  get primaryEvent(): any {
    return this.activeEvents[0] || null;
  }
  loadActiveEvents() {
    this.eventService.getActiveEvents().subscribe({
      next: (response: any) => {
        const data = Array.isArray(response) ? response : response.data;
        this.activeEvents = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading events', err)
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

  addSpotlightToCart(product: any) {
    this.cartService.addToCart(product, 1);
  }

  viewSpotlightDetail(product: any) {
    this.router.navigate(['/detail-product', product.code, product.productName]);
  }

  goToPromo() {
    if (this.primaryEvent) {
      this.router.navigate(['/promo-product'], { 
        queryParams: { eventId: this.primaryEvent.eventId } 
      });
    } else {
      this.router.navigate(['/promo-product']);
    }
  }

  formatPrice(price: number): string {
    return price ? price.toLocaleString('vi-VN') : '0';
  }
}
