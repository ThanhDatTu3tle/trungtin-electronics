import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.html',
  styleUrl: './skeleton-loader.scss',
  standalone: true,
  imports: [CommonModule]
})
export class SkeletonLoader {
  @Input() width: string = '100%';
  @Input() height: string = '3rem';
  @Input() borderRadius: string = '8px';
}
