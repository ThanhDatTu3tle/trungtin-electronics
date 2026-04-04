import { Routes } from '@angular/router';
import { InvoicePage } from './invoice.js';

export const INVOICE_ROUTES: Routes = [
  {
    path: '',
    // loadComponent: () =>
    //   import('./invoice.ts').then(m => m.InvoicePage)
    component: InvoicePage
  }
];