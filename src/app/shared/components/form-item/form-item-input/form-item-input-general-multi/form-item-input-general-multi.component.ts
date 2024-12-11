import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormItemInputBaseComponent } from '../form-item-input-base/form-item-input-base.component';

@Component({
  selector: 'app-form-item-input-general-multi',
  templateUrl: './form-item-input-general-multi.component.html',
  styleUrls: ['./form-item-input-general-multi.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormItemInputGeneralMultiComponent),
      multi: true
    }
  ]
})
export class FormItemInputGeneralMultiComponent extends FormItemInputBaseComponent {
  @Input() debounceTime: number;

  constructor() {
    super();
  }

  writeValue(value: any): void {
    if (Array.isArray(value)) {
      this.internalValue = value;
    } else {
      this.internalValue = [value];
    }
  }

  trackByIdx(i: number) {
    return i;
  }

  addNewSubGraph(): void {
    this.internalValue.push(null);
    this.handleValueChanged(this.internalValue);
  }

  removeSubGraphAtPosition(index: number): void {
    if (index > -1) {
      this.internalValue.splice(index, 1);
    }
  }
}
