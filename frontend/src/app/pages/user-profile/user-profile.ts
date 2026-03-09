import { Component, ChangeDetectorRef  } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
  standalone: true,
  imports: [
    AvatarModule
  ],
})
export class UserProfile {
  private apiUrl = `${environment.apiUrl}/Auth`;

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  userInfo: any;
  getUser() {
    return this.http.get(this.apiUrl + '/me', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
  }

  ngOnInit() {
    // Lấy thông tin người dùng
    this.getUser().subscribe(res => {
      this.userInfo = res;
      this.cd.markForCheck(); // 👈 update UI
    });
  }

  afterLoadUser() {
    console.log('User info:', this.userInfo);
  }
}
