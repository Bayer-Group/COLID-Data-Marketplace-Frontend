import { Component, EventEmitter, Output, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { FormItemChangedDTO } from 'src/app/shared/models/form/form-item-changed-dto';

@Component({
  template: ''
})
export class FormItemInputBaseComponent implements ControlValueAccessor {
  internalValue: any = null;
  @Input() name: string;
  @Input() readOnly: boolean;
  @Input() adminPrivilege: boolean;

  onChange: any = () => {};
  onTouched: any = () => {};

  @Output() valueChanged: EventEmitter<FormItemChangedDTO> =
    new EventEmitter<FormItemChangedDTO>();

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    if (value != null) {
      this.internalValue = value;
    }
  }

  handleValueChanged(publicValue: any) {
    this.onChange(publicValue);
    this.onTouched();

    this.valueChanged.emit(new FormItemChangedDTO(this.name, publicValue));
  }
}
