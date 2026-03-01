import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-primeng-table',
  imports: [CommonModule, TableModule],
  template: `
    <p-table [value]="data.rows" [columns]="data.columns" [paginator]="true" [rows]="10">
      <ng-template pTemplate="header">
        <tr>
          @for (col of data.columns; track col.field) {
            <th>{{ col.header }}</th>
          }
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-row>
        <tr>
          @for (col of data.columns; track col.field) {
            <td>{{ row[col.field] }}</td>
          }
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimeNGTableComponent {
  @Input() data: any;
}
