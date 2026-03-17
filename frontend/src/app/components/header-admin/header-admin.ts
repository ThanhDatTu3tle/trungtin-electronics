import { Component, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';

import { MenuItem } from 'primeng/api';
import { Ripple } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { DrawerModule } from 'primeng/drawer';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.html',
  styleUrl: './header-admin.scss',
  standalone: true,
  imports: [RouterModule, Ripple, ButtonModule, DrawerModule, PanelMenuModule],
})
export class HeaderAdmin {
  @ViewChild('drawerRef') drawerRef!: Drawer;

  closeCallback(e: any): void {
    this.drawerRef.close(e);
  }

  visible: boolean = false;
  adminName = '';

  constructor(private router: Router, private authService: AuthService) {
    const user = localStorage.getItem('adminUser');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        this.adminName = parsed.username || 'Admin';
      } catch {}
    }
  }

  itemsMenu!: MenuItem[];
  itemsMenuSettings!: MenuItem[];
  ngOnInit() {
    this.itemsMenu = [
      {
        label: 'Dashboard',
        icon: 'pi pi-chart-line',
        routerLink: '/admin/dashboard',
      },
      {
        label: 'Danh mục',
        icon: 'pi pi-list',
        routerLink: '/admin/categories',
      },
      {
        label: 'Sản phẩm',
        icon: 'pi pi-th-large',
        routerLink: '/admin/products',
      },
      {
        label: 'Sự kiện giảm giá',
        icon: 'pi pi-gift',
        routerLink: '/admin/events',
      },
      {
        label: 'Đơn hàng',
        icon: 'pi pi-file-edit',
        routerLink: '/admin/orders',
      },
      {
        label: 'CTKM',
        icon: 'pi pi-gift',
        routerLink: '/admin/promotions',
      },
      {
        label: 'Thông báo',
        icon: 'pi pi-comments',
        routerLink: '/admin/notifications',
      }
    ];

    this.itemsMenuSettings = [
      {
        label: 'Cài đặt',
        icon: 'pi pi-cog',
        routerLink: '/admin/settings'
      }
    ]
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

  // routeTo
  routeTo(address: any) {
    this.router.navigate([`/admin/${address}`]);
  }
}
