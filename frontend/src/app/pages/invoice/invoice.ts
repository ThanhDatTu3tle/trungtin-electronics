import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { OrderService, OrderDetail } from '../../services/order.service';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.html',
  styleUrl: './invoice.scss',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule, DividerModule,
    TagModule, ProgressSpinnerModule
  ]
})
export class InvoicePage implements OnInit, OnDestroy {
  order: OrderDetail | null = null;
  isLoading: boolean = true;
  timeLeft: number = 30 * 60; // 30 phút tính bằng giây
  timerInterval: any;
  pollingInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOrder(orderId);
  }

  ngOnDestroy(): void {
    this.clearIntervals();
  }

  loadOrder(orderId: number): void {
    this.orderService.getOrderDetail(orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.isLoading = false;
        this.startCountdown();
        this.startPolling(orderId);
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/cart']);
      }
    });
  }

  // Đếm ngược thời gian còn lại
  startCountdown(): void {
    if (!this.order) return;
    const expiredAt = new Date(this.order.expiredAt).getTime();
    this.timerInterval = setInterval(() => {
      this.timeLeft = Math.max(0, Math.floor((expiredAt - Date.now()) / 1000));
      if (this.timeLeft === 0) {
        this.clearIntervals();
        this.router.navigate(['/payment-result'], {
          queryParams: { status: 'expired', orderId: this.order?.orderID }
        });
      }
    }, 1000);
  }

  // Polling check trạng thái mỗi 3 giây
  startPolling(orderId: number): void {
    this.pollingInterval = setInterval(() => {
      this.orderService.getOrderStatus(orderId).subscribe({
        next: (status) => {
          if (status.status === 'paid') {
            this.clearIntervals();
            this.router.navigate(['/payment-result'], {
              queryParams: { status: 'success', orderId }
            });
          } else if (status.status === 'payment_failed') {
            this.clearIntervals();
            this.router.navigate(['/payment-result'], {
              queryParams: { status: 'failed', orderId }
            });
          }
        }
      });
    }, 3000);
  }

  clearIntervals(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.pollingInterval) clearInterval(this.pollingInterval);
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  getTotalAmount(): number {
    return this.order?.totalAmount || 0;
  }

  confirmPayment(): void {
    // Trong thực tế: redirect sang VNPAY
    // Tạm thời giả lập callback thành công
    if (!this.order) return;
    // TODO: thay bằng redirect VNPAY thật
    this.router.navigate(['/payment-result'], {
      queryParams: { status: 'success', orderId: this.order.orderID }
    });
  }
}
