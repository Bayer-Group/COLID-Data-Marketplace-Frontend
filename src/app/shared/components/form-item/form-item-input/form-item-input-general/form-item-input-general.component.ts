import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormItemInputBaseComponent } from '../form-item-input-base/form-item-input-base.component';

@Component({
  selector: 'app-form-item-input-general',
  templateUrl: './form-item-input-general.component.html',
  styleUrls: ['./form-item-input-general.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormItemInputGeneralComponent),
      multi: true
    }
  ]
})
export class FormItemInputGeneralComponent extends FormItemInputBaseComponent {
  @Input() debounceTime: number;

  constructor() {
    super();
  }
}
