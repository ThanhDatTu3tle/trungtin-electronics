import { Routes } from '@angular/router';
import { DetailProductPage } from './detail-product-page';

export default [
  {
    path: ':code/:name',
    component: DetailProductPage
  }
] as Routes;