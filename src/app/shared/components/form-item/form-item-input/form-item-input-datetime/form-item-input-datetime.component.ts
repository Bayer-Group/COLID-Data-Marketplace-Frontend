import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormItemInputBaseComponent } from '../form-item-input-base/form-item-input-base.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Moment } from 'moment';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

// https://momentjs.com/docs/#/parsing/string-format/
export const DATE_FORMAT = {
  parse: {
    dateInput: 'YYYY-MM-DD'
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

// TODO: Unify - duplicate code with colid-ui-editor-frontend
@Component({
  selector: 'app-form-item-input-datetime',
  templateUrl: './form-item-input-datetime.component.html',
  styleUrls: ['./form-item-input-datetime.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormItemInputDatetimeComponent),
      multi: true
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT }
  ]
})
export class FormItemInputDatetimeComponent extends FormItemInputBaseComponent {
  constructor() {
    super();
  }

  writeValue(value: any): void {
    if (value != null) {
      this.internalValue = new Date(value).toISOString();
    }
  }

  handleDateChanged($event: MatDatepickerInputEvent<Moment>) {
    if ($event.value) {
      this.internalValue = $event.value.utc().format();
      this.handleValueChanged(this.internalValue);
    }
  }
}
