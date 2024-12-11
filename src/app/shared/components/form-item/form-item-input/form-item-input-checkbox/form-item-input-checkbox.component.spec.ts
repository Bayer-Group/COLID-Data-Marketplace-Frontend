import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputCheckboxComponent } from './form-item-input-checkbox.component';
import { MockFormItemInputBaseComponent } from 'src/app/shared/mocks/unit-test-mocks';
import { forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

describe('FormItemInputCheckboxComponent', () => {
  let component: FormItemInputCheckboxComponent;
  let fixture: ComponentFixture<FormItemInputCheckboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormItemInputCheckboxComponent,
        MockFormItemInputBaseComponent
      ],
      imports: [MatRadioModule],
      providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => FormItemInputCheckboxComponent),
          multi: true
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormItemInputCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
