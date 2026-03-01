import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-primeng-carousel',
  imports: [CommonModule, CarouselModule],
  template: `
    <p-carousel
      [value]="data.items || []"
      [numVisible]="data.numVisible || 3"
      [numScroll]="data.numScroll || 1"
      [circular]="data.circular !== false"
      [autoplayInterval]="data.autoplayInterval || 0"
      [responsiveOptions]="data.responsiveOptions || []"
    >
      <ng-template let-item pTemplate="item">
        <div class="carousel-item">
          @if (item.image) {
            <img [src]="item.image" [alt]="item.title || ''" class="img-fluid" />
          }
          @if (item.title) {
            <h3>{{ item.title }}</h3>
          }
          @if (item.description) {
            <p>{{ item.description }}</p>
          }
        </div>
      </ng-template>
    </p-carousel>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimeNGCarouselComponent {
  @Input() data: any;
}

