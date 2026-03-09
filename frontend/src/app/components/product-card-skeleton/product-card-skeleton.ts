import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card-skeleton',
  templateUrl: './product-card-skeleton.html',
  styleUrl: './product-card-skeleton.scss',
  standalone: true,
  imports: [CommonModule]
})
export class ProductCardSkeleton {
  @Input() width: any = '100%';
}
