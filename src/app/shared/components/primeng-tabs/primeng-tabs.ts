import { Component, Input, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-primeng-tabs',
  imports: [CommonModule],
  template: `
    <ul class="nav nav-tabs" role="tablist">
      @for (tab of data.tabs || []; track tab.header; let i = $index) {
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            [class.active]="activeTab() === i"
            (click)="activeTab.set(i)"
            type="button"
            role="tab"
          >
            {{ tab.header }}
          </button>
        </li>
      }
    </ul>
    <div class="tab-content">
      @for (tab of data.tabs || []; track tab.header; let i = $index) {
        <div
          class="tab-pane fade"
          [class.show]="activeTab() === i"
          [class.active]="activeTab() === i"
          role="tabpanel"
        >
          @if (tab.content) {
            <div [innerHTML]="tab.content"></div>
          }
          @if (tab.template) {
            @switch (tab.template) {
              @case ('list') {
                <ul class="list-group">
                  @for (item of tab.items || []; track item) {
                    <li class="list-group-item">{{ item }}</li>
                  }
                </ul>
              }
              @case ('table') {
                <table class="table">
                  <thead>
                    <tr>
                      @for (col of tab.columns || []; track col) {
                        <th>{{ col }}</th>
                      }
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of tab.rows || []; track row) {
                      <tr>
                        @for (col of tab.columns || []; track col) {
                          <td>{{ row[col] }}</td>
                        }
                      </tr>
                    }
                  </tbody>
                </table>
              }
            }
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimeNGTabsComponent {
  @Input() data: any;
  activeTab = signal(0);
}

