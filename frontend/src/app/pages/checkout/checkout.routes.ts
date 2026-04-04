import { Routes } from '@angular/router';
import { CheckoutPage } from './checkout.js';

export const CHECKOUT_ROUTES: Routes = [
  {
    path: '',
    // loadComponent: () =>
    //   import('./checkout.ts').then(m => m.CheckoutPage)
    component: CheckoutPage
  }
];
