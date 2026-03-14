import { Component, HostListener, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormsModule,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

import { usernameEmailPhoneValidator } from '../../shared/validators/validator';

import { MessageService } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Tooltip } from "primeng/tooltip";
import { BadgeModule } from 'primeng/badge';

declare const google: any;
declare const FB: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    DrawerModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    FloatLabelModule,
    DialogModule,
    MessageModule,
    ButtonModule,
    ToastModule,
    Tooltip,
    BadgeModule
  ],
  providers: [MessageService],
})
export class Header {
  private googleInitialized = false;
  private facebookInitialized = false;
  private initializeGoogle() {
    if (!(window as any)['google']) return;

    google.accounts.id.initialize({
      client_id:
        `${environment.client_id_google_auth}`,
      callback: (response: any) => {
        this.handleGoogleToken(response.credential);
      },
    });

    google.accounts.id.renderButton(document.getElementById('googleBtn'), {
      theme: 'outline',
      size: 'large',
    });
  }
  private handleGoogleToken(token: string) {
    this.http.post(`${this.apiUrl}/google-login`, { token }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.isSign = true;
        this.visibleLogIn = false;
        this.visibleRegister = false;
        this.router.navigate(['/']);

        // Lấy thông tin người dùng
        this.userInfo = this.getUser().subscribe({
          next: (res) => {
            this.userInfo = res;
          },
          error: (err) => {
            console.error('Lỗi lấy user:', err);
          },
        });
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Google login thất bại',
        });
      },
    });
  }
  private apiUrl = `${environment.apiUrl}/Auth`;

  @Input() isLogPage: boolean = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private http: HttpClient,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [usernameEmailPhoneValidator]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      role: 'user',
    });
  }

  loginForm: FormGroup;
  formLogined = false;
  registerForm: FormGroup;
  formRegistered = false;

  isSign: boolean = false;
  isSearch: boolean = false;
  isMobileOrTablet: boolean = false;
  sidebarOpen = false;

  // Cart
  cartCount$!: Observable<number>;
  cartShakeAnimation = false;

  // Wishlist
  wishlistCount$!: Observable<number>;
  wishlistShakeAnimation = false;

  userInfo: any;
  getUser() {
    return this.http.get(this.apiUrl + '/me', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
  }

  ngOnInit() {
    this.checkScreen();
    if (!this.googleInitialized) {
      this.googleInitialized = true;
      this.initializeGoogle();
    }
    if (!this.facebookInitialized) {
      this.facebookInitialized = true;
      this.initializeFacebook();
    }
    
    // Initialize cart count observable
    this.cartCount$ = this.cartService.cartCount$;
    
    // Subscribe to cart changes for animation
    this.cartService.cartCount$.subscribe(() => {
      this.triggerCartAnimation();
    });

    // Initialize wishlist count observable
    this.wishlistCount$ = this.wishlistService.wishlistCount$;

    // Subscribe to wishlist changes for animation
    this.wishlistService.wishlistCount$.subscribe(() => {
      this.triggerWishlistAnimation();
    });
    
    if (this.auth.isLoggedIn()) {
      console.log('User is logged in');
      // Lấy thông tin người dùng
      this.userInfo = this.getUser().subscribe({
        next: (res) => {
          this.userInfo = res;
        },
        error: (err) => {
          console.error('Lỗi lấy user:', err);
        },
      });
      this.isSign = true;
      this.router.navigate(['/']);
    } else {
      console.log('User is not logged in');
      this.isSign = false;
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreen();
  }
  checkScreen() {
    if (window.innerWidth < 768) {
      this.isSearch = true;
      this.isMobileOrTablet = true;
    } else {
      this.isSearch = false;
      this.isMobileOrTablet = false;
    }
  }
  toggleSearch() {
    if (!this.isMobileOrTablet) {
      this.isSearch = !this.isSearch;
    }
  }
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  valueSearch: any;

  logout() {
    this.sidebarOpen = false;
    this.isSign = false;
    this.auth.logout();
    this.router.navigate(['/']);
    this.messageService.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Đăng xuất thành công!',
    });
  }

  // Dialog ĐĂNG NHẬP
  visibleLogIn: boolean = false;
  routeToLogin() {
    this.visibleLogIn = true;
  }
  loadingLogin: boolean = false;
  async onLogin() {
    this.loginFormSubmitted = true;
    if (this.loginForm.invalid) return;
    const payload = this.loginForm.value;
    this.loadingLogin = true;
    const res: any = await this.auth.login(payload.username, payload.password);
    this.loadingLogin = false;
    if (res?.success && res?.token) {
      this.isSign = true;
      this.visibleLogIn = false;
      this.sidebarOpen = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Đăng nhập thành công!',
      });
      setTimeout(() => this.router.navigate(['/']), 1000);

      // Lấy thông tin người dùng
      this.userInfo = this.getUser().subscribe({
        next: (res) => {
          this.userInfo = res;
        },
        error: (err) => {
          console.error('Lỗi lấy user:', err);
        },
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Sai tài khoản hoặc mật khẩu!',
      });
    }
  }
  loginFormSubmitted: boolean = false;
  isInvalidLogin(controlName: string) {
    const control = this.loginForm.get(controlName);
    return (
      control?.invalid &&
      (control.touched || this.formLogined) &&
      this.loginFormSubmitted
    );
  }

  // Dialog ĐĂNG KÝ
  visibleRegister: boolean = false;
  routeToRegister() {
    this.visibleRegister = true;
  }
  loadingRegister: boolean = false;
  async onRegister() {
    this.registerFormSubmitted = true;
    if (this.registerForm.invalid) return;
    const payload = this.registerForm.value;
    this.loadingRegister = true;
    this.auth
      .register(
        payload.username,
        payload.password,
        payload.email,
        payload.fullName,
        payload.phone,
        payload.role
      )
      .subscribe({
        next: (res: any) => {
          this.loadingRegister = false;
          this.visibleRegister = false;
          this.visibleLogIn = true;
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đăng ký thành công!',
          });
          this.auth.setToken(res.token);
          this.router.navigate(['/']);
        },
        error: (err: any) => {
          this.loadingRegister = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: err.error?.message || 'Đăng ký thất bại',
          });
        },
      });
  }
  registerFormSubmitted: boolean = false;
  isInvalidRegister(controlName: string) {
    const control = this.registerForm.get(controlName);
    return (
      control?.invalid &&
      (control.touched || this.formRegistered) &&
      this.registerFormSubmitted
    );
  }

  // Chỉ trigger prompt nếu muốn
  onGoogleRegister(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    google.accounts.id.prompt(); // hiển thị popup Google
  }

  onGoogleLogin(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    google.accounts.id.prompt(); // hiển thị popup Google
  }
  renderGoogleButton() {
    if (!(window as any)['google']) return;

    // Kiểm tra div tồn tại
    const btn = document.getElementById('googleBtn');
    if (!btn) return;

    google.accounts.id.renderButton(btn, { theme: 'outline', size: 'large' });
  }

  // Facebook Login
  private initializeFacebook() {
    if (!(window as any)['FB']) {
      // Retry after SDK loads
      setTimeout(() => this.initializeFacebook(), 500);
      return;
    }

    FB.init({
      appId: environment.app_id_facebook_auth,
      cookie: true,
      xfbml: true,
      version: 'v19.0',
    });
  }

  onFacebookLogin() {
    if (!(window as any)['FB']) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Facebook SDK chưa sẵn sàng, vui lòng thử lại.',
      });
      return;
    }

    FB.login(
      (response: any) => {
        if (response.authResponse) {
          this.handleFacebookToken(response.authResponse.accessToken);
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Đã hủy',
            detail: 'Đăng nhập Facebook đã bị hủy.',
          });
        }
      },
      { scope: 'public_profile,email' }
    );
  }

  private handleFacebookToken(token: string) {
    this.http.post(`${this.apiUrl}/facebook-login`, { token }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.isSign = true;
        this.visibleLogIn = false;
        this.visibleRegister = false;
        this.router.navigate(['/']);

        // Lấy thông tin người dùng
        this.userInfo = this.getUser().subscribe({
          next: (res) => {
            this.userInfo = res;
          },
          error: (err) => {
            console.error('Lỗi lấy user:', err);
          },
        });
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Facebook login thất bại',
        });
      },
    });
  }

  // routeToInfo
  routeToInfo() {
    this.router.navigate(['/user-profile']);
  }

  // Cart animation
  triggerCartAnimation() {
    this.cartShakeAnimation = true;
    setTimeout(() => {
      this.cartShakeAnimation = false;
    }, 600);
  }

  // Wishlist animation
  triggerWishlistAnimation() {
    this.wishlistShakeAnimation = true;
    setTimeout(() => {
      this.wishlistShakeAnimation = false;
    }, 600);
  }
}
