import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./promo-product-page').then(m => m.PromoProductPage)
  }
] as Routes;
