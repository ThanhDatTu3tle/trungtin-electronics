import { Routes } from '@angular/router';

// User UI
import { UserLayout } from './layouts/user-layout/user-layout';

// Admin UI
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { AdminLoginComponent } from './pages/admin-login/admin-login';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: UserLayout,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/home-page/home-page.routes').then(m => m.default)
      },
      {
        path: 'detail-product',
        loadChildren: () => import('./pages/detail-product-page/detail-product-page.routes').then(m => m.default)
      },
      {
        path: 'carts',
        loadChildren: () =>
          import('./pages/cart/cart-page.routes').then((m) => m.CART_ROUTES),
      },
      {
        path: 'wishlist',
        loadChildren: () =>
          import('./pages/wishlist/wishlist-page.routes').then((m) => m.WISHLIST_ROUTES),
      },
      {
        path: 'user-profile',
        loadChildren: () => import('./pages/user-profile/user-profile.routes').then(m => m.default)
      },
      {
        path: 'promo-product',
        loadChildren: () => import('./pages/promo-product-page/promo-product-page.routes').then(m => m.default)
      }
    ]
  },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/admin-page/admin-page.routes').then(m => m.default)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/admin-page/dashboard/dashboard.routes').then(m => m.default)
      },
      {
        path: 'categories',
        loadChildren: () => import('./pages/admin-page/categories/categories.routes').then(m => m.default)
      },
      {
        path: 'products',
        loadChildren: () => import('./pages/admin-page/products/products.routes').then(m => m.default)
      },
      {
        path: 'events',
        loadChildren: () => import('./pages/admin-page/events/events.routes').then(m => m.default)
      },
      {
        path: 'orders',
        loadChildren: () => import('./pages/admin-page/orders/orders.routes').then(m => m.default)
      },
      {
        path: 'promotions',
        loadChildren: () => import('./pages/admin-page/promotions/promotions.routes').then(m => m.default)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./pages/admin-page/notifications/notifications.routes').then(m => m.default)
      },
      {
        path: 'settings',
        loadChildren: () => import('./pages/admin-page/settings/settings.routes').then(m => m.default)
      }
    ]
  },
  {
    path: 'admin/login',
    component: AdminLoginComponent
  }
];
