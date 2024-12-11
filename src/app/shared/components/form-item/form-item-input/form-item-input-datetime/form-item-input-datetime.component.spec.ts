import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  DATE_FORMAT,
  FormItemInputDatetimeComponent
} from './form-item-input-datetime.component';
import { forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS
} from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockFormItemInputBaseComponent } from 'src/app/shared/mocks/unit-test-mocks';
import { LastIndexStringPipe } from 'src/app/shared/pipes/last-index-string.pipe';

describe('FormItemInputDatetimeComponent', () => {
  let component: FormItemInputDatetimeComponent;
  let fixture: ComponentFixture<FormItemInputDatetimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormItemInputDatetimeComponent,
        MockFormItemInputBaseComponent,
        LastIndexStringPipe
      ],
      imports: [
        NoopAnimationsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule
      ],
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
    }).compileComponents();

    fixture = TestBed.createComponent(FormItemInputDatetimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
