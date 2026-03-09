import { Component } from '@angular/core';

import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  standalone: true,
  imports: [TooltipModule]
})
export class Footer {

}
