import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section [id]="sectionId" [class]="wrapperClass">
      <div class="container">
        @if (title) {
          <div class="section-header mb-4">
            <h2 [class]="titleClass">{{ title }}</h2>
            @if (subtitle) {
              <p class="text-muted">{{ subtitle }}</p>
            }
          </div>
        }
        
        <div [ngClass]="contentClass">
          <ng-content></ng-content>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .section-header {
      text-align: center;
    }
    
    .section-header h2 {
      margin-bottom: 0.5rem;
    }
  `]
})
export class SectionWrapperComponent {
  @Input() sectionId?: string;
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() wrapperClass: string = '';
  @Input() titleClass: string = 'h2';
  @Input() contentClass: string = '';
}

