import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-payment-result',
  templateUrl: './payment-result.html',
  standalone: true,
  imports: [CommonModule, ButtonModule]
})
export class PaymentResultPage implements OnInit {
  status: string = '';
  orderId: number = 0;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.status  = this.route.snapshot.queryParamMap.get('status') || '';
    this.orderId = Number(this.route.snapshot.queryParamMap.get('orderId'));
  }

  goHome(): void    { this.router.navigate(['/']); }
  goToCart(): void  { this.router.navigate(['/cart']); }
}
