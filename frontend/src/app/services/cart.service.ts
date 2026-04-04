import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  productId: number;
  productName: string;
  code: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  quantity: number;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_STORAGE_KEY = 'shopping_cart';
  private cartItems: CartItem[] = [];
  private cartCountSubject = new BehaviorSubject<number>(0);
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);

  // Observable for cart count (reactive updates)
  public cartCount$: Observable<number> = this.cartCountSubject.asObservable();
  
  // Observable for cart items
  public cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  /**
   * Load cart from localStorage
   */
  private loadCartFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.CART_STORAGE_KEY);
      if (stored) {
        this.cartItems = JSON.parse(stored);
        this.updateObservables();
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      this.cartItems = [];
    }
  }

  /**
   * Save cart to localStorage
   */
  private saveCartToStorage(): void {
    try {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(this.cartItems));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  /**
   * Update observables with current cart state
   */
  private updateObservables(): void {
    this.cartCountSubject.next(this.getTotalQuantity());
    this.cartItemsSubject.next([...this.cartItems]);
  }

  /**
   * Add product to cart
   * If product already exists, increment quantity
   */
  addToCart(product: any, quantity: number = 1): void {
    const existingItem = this.cartItems.find(item => item.productId === product.productId);

    if (existingItem) {
      // Product already in cart, increment quantity
      existingItem.quantity += quantity;
      
      // Don't exceed stock
      if (existingItem.quantity > product.stock) {
        existingItem.quantity = product.stock;
      }
    } else {
      // New product, add to cart
      const cartItem: CartItem = {
        productId: product.productId,
        productName: product.productName,
        code: product.code,
        price: product.price,
        discountPrice: product.discountPrice,
        imageUrl: product.imageUrl,
        quantity: Math.min(quantity, product.stock),
        stock: product.stock
      };
      this.cartItems.push(cartItem);
    }

    this.saveCartToStorage();
    this.updateObservables();
  }

  /**
   * Remove product from cart
   */
  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.productId !== productId);
    this.saveCartToStorage();
    this.updateObservables();
  }

  /**
   * Update product quantity in cart
   */
  updateQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.productId === productId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = Math.min(quantity, item.stock);
        this.saveCartToStorage();
        this.updateObservables();
      }
    }
  }

  /**
   * Get all cart items
   */
  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  /**
   * Get cart item count (number of unique products)
   */
  getCartCount(): number {
    return this.cartItems.length;
  }

  /**
   * Get total quantity of all items
   */
  getTotalQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Get total price of all items in cart
   */
  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      const price = item.discountPrice ? item.price*((100 - item.discountPrice)/100) : item.price;
      return total + (price * item.quantity);
    }, 0);
  }

  /**
   * Clear all items from cart
   */
  clearCart(): void {
    this.cartItems = [];
    this.saveCartToStorage();
    this.updateObservables();
  }

  /**
   * Check if product is in cart
   */
  isInCart(productId: number): boolean {
    return this.cartItems.some(item => item.productId === productId);
  }

  /**
   * Get quantity of specific product in cart
   */
  getProductQuantity(productId: number): number {
    const item = this.cartItems.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  }
}
