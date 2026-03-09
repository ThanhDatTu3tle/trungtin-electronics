import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.scss',
  standalone: true,
  imports: [
    RouterModule,

    Header, 
    Footer
  ]
})
export class UserLayout {}
