import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private apiUrl = `${environment.apiUrl}/Auth`;

  constructor(private http: HttpClient) {}

  // Get Me
  getMe() {
    const token = localStorage.getItem('token');
    console.log(token);
    return this.http.get(`${this.apiUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // 🔹 Register với username/email & password - Cho User
  register(username: string, password: string, email: string, fullName: string, phone: string, role: string) {
    const payload = { username, password, email, fullName, phone, role };
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  // 🔹 Login với username/email & password - Cho User
  async login(usernameOrEmailOrPhone: string, password: string): Promise<any> {
    try {
      const response: any = await this.http
        .post(`${this.apiUrl}/login`, { usernameOrEmailOrPhone, password })
        .toPromise();

      if (response && response.token) {
        this.setToken(response.token);
        this.startAutoLogout(response.token);
        return { success: true, token: response.token, role: response.role };
      }
      return { success: false, error: response.result };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error };
    }
  }

  // 🔹 Lưu token khi login - Cho Admin
  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // 🔹 Lấy token hiện tại
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // 🔹 Xoá token khi logout
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // 🔹 Kiểm tra đăng nhập
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  // 🔹 Giải mã token lấy thông tin user
  getUserInfo(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }

  // 🔹 Kiểm tra token hết hạn chưa
  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      if (!decoded.exp) return true;

      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (e) {
      return true; // lỗi decode => coi như hết hạn
    }
  }

  // 🔹 Lưu timeout id để clear nếu cần
  private logoutTimer: any = null;
  // 🔹 Xoá token khi đã quá 12 tiếng
  // 🔹 Gọi mỗi khi đăng nhập thành công
  startAutoLogout(token: string) {
    const decoded: any = jwtDecode(token);
    if (!decoded.exp) return;

    const currentTime = Date.now();
    const expTime = decoded.exp * 1000; // convert to ms
    const timeout = expTime - currentTime;

    if (timeout > 0) {
      this.logoutTimer = setTimeout(() => {
        this.logout();
      }, timeout);
    }
  }
}
