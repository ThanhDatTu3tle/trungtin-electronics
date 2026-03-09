import { Component, ChangeDetectorRef, HostListener  } from '@angular/core';
import { CommonModule } from '@angular/common';

// Thư viện Primeng
import { Tooltip } from 'primeng/tooltip';

// Services
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

// Components
import { Carousel } from './carousel/carousel';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductGalleria } from '../../components/product-galleria/product-galleria';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  standalone: true,
  imports: [CommonModule, Tooltip, Carousel, ProductCard, ProductGalleria],
})
export class HomePage {
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadDataCategory();
    this.loadDataProduct();
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

          let limit = 4;
          if (this.screenWidth >= 768 && this.screenWidth < 1024) limit = 3;

          this.productListNew = newProducts.slice(0, limit);
          this.productListOutstanding = featuredProducts;
          this.productListDiscount = discountProducts.slice(0, limit);
          
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

  images = [
    {
      itemImageSrc: '/assets/image/products/DK-CS2600.png',
      thumbnailImageSrc: '/assets/image/products/DK-CS2600.png',
      alt: 'DK-CS2600',
      title: 'DK-CS2600',
    },
    {
      itemImageSrc: '/assets/image/products/DK-AC3950PRO.png',
      thumbnailImageSrc: '/assets/image/products/DK-AC3950PRO.png',
      alt: 'DK-CS2600',
      title: 'DK-CS2600',
    },
    {
      itemImageSrc: '/assets/image/products/DK-DH65XPro.png',
      thumbnailImageSrc: '/assets/image/products/DK-DH65XPro.png',
      alt: 'DK-CS2600',
      title: 'DK-CS2600',
    },
  ];
}
