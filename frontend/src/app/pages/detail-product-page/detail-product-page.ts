import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

// Services
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';

// Components
import { ProductCard } from '../../components/product-card/product-card';

// Primeng
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { GalleriaModule } from 'primeng/galleria';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-detail-product-page',
  templateUrl: './detail-product-page.html',
  styleUrl: './detail-product-page.scss',
  imports: [
    CommonModule,
    RouterModule,
    ProductCard,
    BreadcrumbModule,
    GalleriaModule,
    PanelModule,
    ButtonModule,
    TagModule,
    DividerModule
  ],
})
export class DetailProductPage {
  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private categoryService: CategoryService,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  items: MenuItem[] = [];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

  code: string = '';
  name: string = '';
  active = '';
  
  // Product data
  product: any = null;
  isProductLoading = true;
  
  // Categories
  categories: any[] = [];
  
  // Related products
  relatedProducts: any[] = [];
  isRelatedProductsLoading = false;
  
  // Viewed products
  viewedProducts: any[] = [];
  


  // Galleria responsive options
  galleriaResponsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 4
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 2
    }
  ];

  ngOnInit() {
    this.loadDataCategory();
    this.loadViewedProducts();

    this.code = this.route.snapshot.paramMap.get('code') || '';
    this.name = this.route.snapshot.paramMap.get('name') || '';

    this.items.push({ label: `${this.name} ${this.code}` });

    this.loadDataProduct(this.code);
  }

  loadDataCategory() {
    this.categoryService.getAllCategories().subscribe((response: any) => {
      // Handle both wrapped and direct array responses
      const data = Array.isArray(response) ? response : response.data;
      this.categories = data || [];
      this.cdr.detectChanges();
    });
  }

  loadDataProduct(productCode: string) {
    this.isProductLoading = true;
    this.productService.getProductByCode(productCode).subscribe({
      next: (response: any) => {
        // Handle both wrapped and direct array responses
        const data = Array.isArray(response) ? response : response.data;
        
        if (data && data.length > 0) {
          this.product = data[0];
          
          // Add to viewed products
          this.addToViewedProducts(this.product);
          
          // Load related products from same category
          if (this.product.categoryId) {
            this.loadRelatedProducts(this.product.categoryId, this.product.productId);
          }
        }
        this.isProductLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.isProductLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadRelatedProducts(categoryId: number, currentProductId: number) {
    this.isRelatedProductsLoading = true;
    this.productService.getAllProducts(undefined, categoryId.toString()).subscribe({
      next: (response: any) => {
        // Handle both wrapped and direct array responses
        const data = Array.isArray(response) ? response : response.data;
        
        if (data) {
          // Filter out current product and limit to 8 products
          this.relatedProducts = data
            .filter((p: any) => p.productId !== currentProductId)
            .slice(0, 8);
        }
        this.isRelatedProductsLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading related products:', err);
        this.isRelatedProductsLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Viewed products management
  loadViewedProducts() {
    try {
      const stored = localStorage.getItem('viewedProducts');
      if (stored) {
        this.viewedProducts = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading viewed products:', error);
      this.viewedProducts = [];
    }
  }

  addToViewedProducts(product: any) {
    if (!product || !product.productId) return;

    // Remove if already exists
    this.viewedProducts = this.viewedProducts.filter(
      (p: any) => p.productId !== product.productId
    );

    // Add to beginning
    this.viewedProducts.unshift(product);

    // Keep only last 10
    if (this.viewedProducts.length > 10) {
      this.viewedProducts = this.viewedProducts.slice(0, 10);
    }

    // Save to localStorage
    try {
      localStorage.setItem('viewedProducts', JSON.stringify(this.viewedProducts));
    } catch (error) {
      console.error('Error saving viewed products:', error);
    }
  }

  // Wishlist management
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

  // Cart management
  addToCart(product: any) {
    if (product.stock <= 0) {
      return;
    }
    
    this.cartService.addToCart(product, 1);
    
    // Show success message (you'll need to add MessageService if not already present)
    console.log('Product added to cart:', product.productName);
  }

  // Image gallery
  get productImages() {
    if (!this.product || !this.product.imageUrl) {
      return [];
    }
    
    // For now, use the single product image
    // In the future, you could have multiple images per product
    return [
      {
        itemImageSrc: this.product.imageUrl,
        thumbnailImageSrc: this.product.imageUrl,
        alt: this.product.productName,
        title: this.product.productName,
      }
    ];
  }
}
