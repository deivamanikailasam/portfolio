import { Component, Input, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-primeng-drawer',
  imports: [CommonModule],
  template: `
    @if (data.showToggle !== false) {
      <button
        class="btn btn-primary mb-3"
        (click)="visible.set(!visible())"
        type="button"
      >
        <i [class]="visible() ? 'pi pi-times' : 'pi pi-bars'"></i>
        {{ data.toggleLabel || 'Toggle Drawer' }}
      </button>
    }
    <div
      [class]="'offcanvas offcanvas-' + (data.position || 'end')"
      [class.show]="visible()"
      [class.showing]="visible()"
      [style.width]="data.width || '30rem'"
      tabindex="-1"
      [attr.id]="'drawer-' + (data.id || 'drawer')"
    >
      <div class="offcanvas-header">
        @if (data.title) {
          <h2 class="offcanvas-title">{{ data.title }}</h2>
        }
        @if (data.showCloseIcon !== false) {
          <button
            type="button"
            class="btn-close"
            (click)="visible.set(false)"
            aria-label="Close"
          ></button>
        }
      </div>
      <div class="offcanvas-body">
        @if (data.content) {
          <div [innerHTML]="data.content"></div>
        }
        @if (data.items) {
          <ul class="list-group">
            @for (item of data.items; track item) {
              <li class="list-group-item">{{ item }}</li>
            }
          </ul>
        }
      </div>
      @if (data.footer) {
        <div class="offcanvas-footer p-3 border-top">
          <div [innerHTML]="data.footer"></div>
        </div>
      }
    </div>
    @if (data.modal !== false && visible()) {
      <div
        class="offcanvas-backdrop fade show"
        (click)="visible.set(false)"
      ></div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimeNGDrawerComponent implements OnInit {
  @Input() data: any;
  
  visible = signal(false);
  
  ngOnInit(): void {
    if (this.data?.visible !== undefined) {
      this.visible.set(this.data.visible);
    }
  }
}

