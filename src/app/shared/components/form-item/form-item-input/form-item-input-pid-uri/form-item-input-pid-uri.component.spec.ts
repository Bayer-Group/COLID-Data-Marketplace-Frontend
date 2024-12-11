import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputPidUriComponent } from './form-item-input-pid-uri.component';
import { forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import {
  MockDebounceDirective,
  MockFormItemInputBaseComponent
} from 'src/app/shared/mocks/unit-test-mocks';
import { LastIndexStringPipe } from 'src/app/shared/pipes/last-index-string.pipe';

describe('FormItemInputPidUriComponent', () => {
  let component: FormItemInputPidUriComponent;
  let fixture: ComponentFixture<FormItemInputPidUriComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormItemInputPidUriComponent,
        MockFormItemInputBaseComponent,
        LastIndexStringPipe,
        MockDebounceDirective
      ],
      imports: [
        FontAwesomeTestingModule,
        FormsModule,
        MatButtonModule,
        MatMenuModule
      ],
      providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => FormItemInputPidUriComponent),
          multi: true
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormItemInputPidUriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
