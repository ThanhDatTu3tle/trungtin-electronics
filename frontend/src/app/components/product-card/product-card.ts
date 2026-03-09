import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ProductCardSkeleton } from '../product-card-skeleton/product-card-skeleton';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
  standalone: true,
  imports: [
    CommonModule,

    ProductCardSkeleton,

    ButtonModule
  ]
})
export class ProductCard implements OnChanges {
  @Input() name!: string;
  @Input() code!: string;
  @Input() price!: number;
  @Input() imageUrl!: string;
  @Input() discountPercent: number | null = null; // Phần trăm giảm giá (ví dụ: 10, 15...)
  
  @Input() tags: string[] = [];

  // Tính giá sau khi giảm
  get discountedPrice(): number | null {
    if (this.discountPercent && this.discountPercent > 0 && this.price) {
      return this.price * (1 - this.discountPercent / 100);
    }
    return null;
  }

  @Input() isInWishlist = false;
  @Input() isLoadingProduct = false;

  @Output() addToWishlist = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<void>();

  constructor(private router: Router) {}

  ngOnChanges(changes: SimpleChanges) {
    // console.log('ProductCard Input Changes:', changes);
  }

  ngOnInit() {
    // console.log('ProductCard Init. isLoadingProduct:', this.isLoadingProduct);
  }

  toggleWishlist() {
    this.addToWishlist.emit();
  }

  addCart() {
    this.addToCart.emit();
  }

  // route to Detail Product Page
  routeToDetail(name: any, code: any) {
    this.router.navigate(['/detail-product', code, name]);
  }
}
