import { Component, Input, Self, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, NgControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="flex flex-col gap-1">
      <!-- <label class="text-sm font-medium">{{ label() }}</label> -->
      <textarea
        class="w-full border border-gray-400
         rounded px-3 py-2 focus:outline-none focus:ring-2
          focus:ring-primary resize-vertical"
        [class.input-error]="control.invalid && control.touched"
        [class.input-success]="control.valid && control.touched"
        [formControl]="control"
        [placeholder]="label()"
        [rows]="rows()"
        [maxlength]="maxLength()"
      ></textarea>

      @if (control.hasError('required') && control.touched) {
        <div class="mt-1 text-red-500 text-xs">{{label()}} is required</div>
      }

      @if (control.hasError('minlength') && control.touched) {
        <div class="mt-1 text-red-500 text-xs">
          {{label()}} must be at least {{control.getError('minlength')?.requiredLength}} characters
        </div>
      }

      @if (control.hasError('maxlength') && control.touched) {
        <div class="mt-1 text-red-500 text-xs">
          {{label()}} cannot exceed {{control.getError('maxlength')?.requiredLength}} characters
        </div>
      }

      @if (maxLength() && control.value) {
        <div class="mt-1 text-xs text-gray-500">
          {{control.value.length}}/{{maxLength()}} characters
        </div>
      }
    </div>
  `,

})
export class Textarea implements ControlValueAccessor  {



 @Input() control!: FormControl;

  // Using signals for consistency with your existing code
  label = signal('');
  rows = signal(4);
  maxLength = signal<number | null>(null);

  @Input() set labelText(value: string) {
    this.label.set(value);
  }

  @Input() set rowCount(value: number) {
    this.rows.set(value);
  }

  @Input() set maxLengthValue(value: number | null) {
    this.maxLength.set(value);
  }

  value: string = '';

  onChange = (value: string) => {};
  onTouched = () => {};

  onInput(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Handle disabled state if needed
  }


}
