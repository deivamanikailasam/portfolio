import { Component, Input, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepsModule } from 'primeng/steps';

@Component({
  selector: 'app-primeng-stepper',
  imports: [CommonModule, StepsModule],
  template: `
    <p-steps
      [model]="steps()"
      [activeIndex]="activeIndex()"
      [readonly]="data.readonly !== false"
    ></p-steps>
    @if (data.showContent !== false && steps().length > 0) {
      <div class="stepper-content mt-4">
        @if (steps()[activeIndex()]; as currentStep) {
          <div class="card">
            <div class="card-body">
              <h3 class="card-title">{{ currentStep.label }}</h3>
              @if (currentStep.data?.content) {
                <p class="card-text">{{ currentStep.data.content }}</p>
              }
              @if (currentStep.data?.description) {
                <p class="text-muted">{{ currentStep.data.description }}</p>
              }
            </div>
          </div>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimeNGStepperComponent implements OnInit {
  @Input() data: any;
  
  activeIndex = signal(0);
  
  steps = signal<any[]>([]);
  
  ngOnInit(): void {
    if (this.data?.steps) {
      this.steps.set(this.data.steps);
    }
    if (this.data?.activeIndex !== undefined) {
      this.activeIndex.set(this.data.activeIndex);
    }
  }
}

