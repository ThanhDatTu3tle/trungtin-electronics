import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HeaderAdmin } from '../../components/header-admin/header-admin';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
  standalone: true,
  imports: [
    RouterModule,
    
    HeaderAdmin
  ]
})
export class AdminLayout {}
