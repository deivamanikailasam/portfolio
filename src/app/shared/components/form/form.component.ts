import { Component, Input, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form()" (ngSubmit)="onSubmit()" [class]="data.formClass || ''">
      @for (field of data.fields || []; track field.name) {
        <div class="mb-3">
          <label [for]="field.name" class="form-label">
            {{ field.label || field.name }}
            @if (field.required) {
              <span class="text-danger">*</span>
            }
          </label>
          @switch (field.type) {
            @case ('textarea') {
              <textarea
                [id]="field.name"
                [formControlName]="field.name"
                class="form-control"
                [rows]="field.rows || 3"
                [placeholder]="field.placeholder || ''"
              ></textarea>
            }
            @case ('select') {
              <select
                [id]="field.name"
                [formControlName]="field.name"
                class="form-select"
              >
                <option value="">{{ field.placeholder || 'Select...' }}</option>
                @for (option of field.options || []; track option) {
                  <option [value]="typeof option === 'string' ? option : option.value">
                    {{ typeof option === 'string' ? option : option.label }}
                  </option>
                }
              </select>
            }
            @case ('checkbox') {
              <div class="form-check">
                <input
                  [id]="field.name"
                  [formControlName]="field.name"
                  type="checkbox"
                  class="form-check-input"
                />
                <label [for]="field.name" class="form-check-label">
                  {{ field.checkboxLabel || field.label }}
                </label>
              </div>
            }
            @default {
              <input
                [id]="field.name"
                [formControlName]="field.name"
                [type]="field.type || 'text'"
                class="form-control"
                [placeholder]="field.placeholder || ''"
              />
            }
          }
          @if (form().get(field.name)?.invalid && form().get(field.name)?.touched) {
            <div class="text-danger small">
              @if (form().get(field.name)?.errors?.['required']) {
                This field is required
              }
              @if (form().get(field.name)?.errors?.['email']) {
                Please enter a valid email
              }
            </div>
          }
        </div>
      }
      
      @if (data.showSubmit !== false) {
        <div class="mb-3">
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="form().invalid"
          >
            {{ data.submitLabel || 'Submit' }}
          </button>
          @if (data.showReset !== false) {
            <button
              type="button"
              class="btn btn-secondary ms-2"
              (click)="onReset()"
            >
              {{ data.resetLabel || 'Reset' }}
            </button>
          }
        </div>
      }
      
      @if (submitMessage()) {
        <div class="alert" [class]="submitSuccess() ? 'alert-success' : 'alert-danger'">
          {{ submitMessage() }}
        </div>
      }
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnInit {
  @Input() data: any;
  
  form = signal<FormGroup>(new FormGroup({}));
  submitMessage = signal<string | null>(null);
  submitSuccess = signal(false);
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    this.form.set(this.fb.group({}));
    const formControls: any = {};
    
    if (this.data?.fields) {
      this.data.fields.forEach((field: any) => {
        const validators = [];
        if (field.required) {
          validators.push(Validators.required);
        }
        if (field.type === 'email') {
          validators.push(Validators.email);
        }
        formControls[field.name] = [field.defaultValue || '', validators];
      });
    }
    
    this.form.set(this.fb.group(formControls));
  }
  
  onSubmit(): void {
    if (this.form().valid) {
      const formValue = this.form().value;
      console.log('Form submitted:', formValue);
      
      if (this.data?.onSubmit) {
        this.data.onSubmit(formValue);
      }
      
      this.submitSuccess.set(true);
      this.submitMessage.set(this.data?.successMessage || 'Form submitted successfully!');
      
      setTimeout(() => {
        this.submitMessage.set(null);
      }, 3000);
    } else {
      this.form().markAllAsTouched();
    }
  }
  
  onReset(): void {
    this.form().reset();
    this.submitMessage.set(null);
  }
}

