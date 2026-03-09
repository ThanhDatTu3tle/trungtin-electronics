import { Component, Input } from '@angular/core';

import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'app-product-galleria',
  templateUrl: './product-galleria.html',
  styleUrl: './product-galleria.scss',
  standalone: true,
  imports: [GalleriaModule],
})
export class ProductGalleria {
  @Input() dataImage: any;
  @Input() position: any;
  @Input() numVisible: number = 3;

  @Input() widthImageSrc: any;
  @Input() widthImageThumb: any;

  responsiveOptions: any[] = [
    {
      breakpoint: '1300px',
      numVisible: 3,
    },
    {
      breakpoint: '575px',
      numVisible: 3,
    },
  ];
}
