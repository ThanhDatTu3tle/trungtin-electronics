import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

import { usernameEmailPhoneValidator } from '../../shared/validators/validator';

import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.scss'],
  imports: [
    ReactiveFormsModule, 
    
    InputTextModule, 
    ButtonModule, 
    ToastModule,
    MessageModule
  ],
  providers: [MessageService],
})
export class AdminLoginComponent {
  private apiUrl = `${environment.apiUrl}/Auth`;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private auth: AuthService
  ) {
    this.exampleForm = this.fb.group({
      username: ['', [usernameEmailPhoneValidator]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  exampleForm: FormGroup;
  formSubmitted = false;

  ngOnInit() {
    // Nếu đã login rồi thì chuyển thẳng về /admin
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/admin']);
    }
  }

  loading: boolean = false;
  async onSubmit() {
    if (this.exampleForm.invalid) return;

    this.loading = true;

    try {
      const payload = this.exampleForm.value;
      const res: any = await this.auth.login(payload.username, payload.password);
      console.log(res);

      if (res?.success) {
        if (res?.role == 'admin') {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đăng nhập thành công!',
          });
          setTimeout(() => this.router.navigate(['/admin/dashboard']), 2000);
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Cảnh báo!!!',
            detail: 'Không phải admin vui lòng không vớ vẩn!',
          });
          this.auth.logout();
          setTimeout(() => this.router.navigate(['/']), 2000);
        }
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Sai tài khoản hoặc mật khẩu!',
        });
      }
    } catch (e) {
      console.error(e);
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể kết nối server!',
      });
    } finally {
      this.loading = false;
    }
  }

  isInvalid(controlName: string) {
    const control = this.exampleForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  routeToForgotPassword() {}

  routeToHomePage() {
    this.router.navigate(['/']);
  }
}
