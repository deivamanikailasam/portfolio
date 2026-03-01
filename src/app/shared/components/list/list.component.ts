import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  imports: [CommonModule],
  template: `
    @if (data.type === 'ordered') {
      <ol [class]="data.listClass || 'list-group list-group-numbered'">
        @for (item of data.items || []; track item) {
          <li class="list-group-item">
            @if (typeof item === 'string') {
              {{ item }}
            } @else {
              @if (item.label) {
                <strong>{{ item.label }}:</strong> {{ item.value }}
              } @else {
                {{ item }}
              }
            }
          </li>
        }
      </ol>
    } @else {
      <ul [class]="data.listClass || 'list-group'">
        @for (item of data.items || []; track item) {
          <li class="list-group-item">
            @if (typeof item === 'string') {
              {{ item }}
            } @else {
              @if (item.icon) {
                <i [class]="item.icon"></i>
              }
              @if (item.label) {
                <strong>{{ item.label }}:</strong> {{ item.value }}
              } @else {
                {{ item }}
              }
              @if (item.badge) {
                <span class="badge bg-primary ms-2">{{ item.badge }}</span>
              }
            }
          </li>
        }
      </ul>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {
  @Input() data: any;
}

