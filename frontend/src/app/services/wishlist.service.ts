import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface WishlistItem {
  productId: number;
  productName: string;
  code: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly WISHLIST_STORAGE_KEY = 'wishlist';
  private wishlistItems: WishlistItem[] = [];
  private wishlistCountSubject = new BehaviorSubject<number>(0);
  private wishlistItemsSubject = new BehaviorSubject<WishlistItem[]>([]);

  // Observable for wishlist count (reactive updates)
  public wishlistCount$: Observable<number> = this.wishlistCountSubject.asObservable();
  
  // Observable for wishlist items
  public wishlistItems$: Observable<WishlistItem[]> = this.wishlistItemsSubject.asObservable();

  constructor() {
    this.loadWishlistFromStorage();
  }

  /**
   * Load wishlist from localStorage
   */
  private loadWishlistFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.WISHLIST_STORAGE_KEY);
      if (stored) {
        this.wishlistItems = JSON.parse(stored);
        this.updateObservables();
      }
    } catch (error) {
      console.error('Error loading wishlist from storage:', error);
      this.wishlistItems = [];
    }
  }

  /**
   * Save wishlist to localStorage
   */
  private saveWishlistToStorage(): void {
    try {
      localStorage.setItem(this.WISHLIST_STORAGE_KEY, JSON.stringify(this.wishlistItems));
    } catch (error) {
      console.error('Error saving wishlist to storage:', error);
    }
  }

  /**
   * Update observables with current wishlist state
   */
  private updateObservables(): void {
    this.wishlistCountSubject.next(this.getWishlistCount());
    this.wishlistItemsSubject.next([...this.wishlistItems]);
  }

  /**
   * Add product to wishlist
   */
  addToWishlist(product: any): void {
    if (this.isInWishlist(product.productId)) {
      return;
    }

    const wishlistItem: WishlistItem = {
      productId: product.productId,
      productName: product.productName,
      code: product.code,
      price: product.price,
      discountPrice: product.discountPrice,
      imageUrl: product.imageUrl,
      stock: product.stock
    };
    
    this.wishlistItems.push(wishlistItem);
    this.saveWishlistToStorage();
    this.updateObservables();
  }

  /**
   * Remove product from wishlist
   */
  removeFromWishlist(productId: number): void {
    this.wishlistItems = this.wishlistItems.filter(item => item.productId !== productId);
    this.saveWishlistToStorage();
    this.updateObservables();
  }

  /**
   * Get all wishlist items
   */
  getWishlistItems(): WishlistItem[] {
    return [...this.wishlistItems];
  }

  /**
   * Get wishlist item count
   */
  getWishlistCount(): number {
    return this.wishlistItems.length;
  }

  /**
   * Clear all items from wishlist
   */
  clearWishlist(): void {
    this.wishlistItems = [];
    this.saveWishlistToStorage();
    this.updateObservables();
  }

  /**
   * Check if product is in wishlist
   */
  isInWishlist(productId: number): boolean {
    return this.wishlistItems.some(item => item.productId === productId);
  }
}
