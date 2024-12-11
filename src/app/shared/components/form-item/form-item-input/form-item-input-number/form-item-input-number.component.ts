import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormItemInputBaseComponent } from '../form-item-input-base/form-item-input-base.component';

// TODO: Unify - duplicate code with colid-ui-editor-frontend
@Component({
  selector: 'app-form-item-input-number',
  templateUrl: './form-item-input-number.component.html',
  styleUrls: ['./form-item-input-number.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormItemInputNumberComponent),
      multi: true
    }
  ]
})
export class FormItemInputNumberComponent extends FormItemInputBaseComponent {
  constructor() {
    super();
  }
}
