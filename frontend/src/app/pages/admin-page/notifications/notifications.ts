import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
  standalone: true,
  imports: [
    RouterModule,

    BreadcrumbModule
  ],
})
export class Notifications {

  items: MenuItem[] = [{ label: 'Admin' }, { label: 'Notifications', routerLink: '/admin/notifications' }];

  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
}
