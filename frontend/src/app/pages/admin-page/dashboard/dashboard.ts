import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  standalone: true,
  imports: [
    RouterModule,

    BreadcrumbModule
  ]
})
export class Dashboard {

  items: MenuItem[] = [{ label: 'Quản lý' }, { label: 'Thống kê', routerLink: '/admin/dashboard' }];

  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
}
