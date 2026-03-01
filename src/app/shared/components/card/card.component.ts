import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  template: `
    <div class="card" [class]="data.cardClass || ''">
      @if (data.image) {
        <img [src]="data.image" [alt]="data.title || ''" class="card-img-top" [style.height.px]="data.imageHeight || 200" />
      }
      <div class="card-body">
        @if (data.title) {
          <h5 class="card-title">{{ data.title }}</h5>
        }
        @if (data.subtitle) {
          <h6 class="card-subtitle mb-2 text-muted">{{ data.subtitle }}</h6>
        }
        @if (data.content) {
          <p class="card-text">{{ data.content }}</p>
        }
        @if (data.htmlContent) {
          <div [innerHTML]="data.htmlContent"></div>
        }
        @if (data.items && data.items.length > 0) {
          <ul class="list-group list-group-flush">
            @for (item of data.items; track item) {
              <li class="list-group-item">{{ item }}</li>
            }
          </ul>
        }
        @if (data.actions && data.actions.length > 0) {
          <div class="mt-3">
            @for (action of data.actions; track action.label) {
              <a
                [href]="action.url || '#'"
                [class]="action.class || 'btn btn-primary me-2'"
                [target]="action.target || '_self'"
              >
                {{ action.label }}
              </a>
            }
          </div>
        }
      </div>
      @if (data.footer) {
        <div class="card-footer">
          <small class="text-muted">{{ data.footer }}</small>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  @Input() data: any;
}

