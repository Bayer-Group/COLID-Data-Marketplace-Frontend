import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputNumberComponent } from './form-item-input-number.component';
import { forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MockFormItemInputBaseComponent } from 'src/app/shared/mocks/unit-test-mocks';
import { LastIndexStringPipe } from 'src/app/shared/pipes/last-index-string.pipe';

describe('FormItemInputNumberComponent', () => {
  let component: FormItemInputNumberComponent;
  let fixture: ComponentFixture<FormItemInputNumberComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormItemInputNumberComponent,
        MockFormItemInputBaseComponent,
        LastIndexStringPipe
      ],
      imports: [FormsModule],
      providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => FormItemInputNumberComponent),
          multi: true
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormItemInputNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
