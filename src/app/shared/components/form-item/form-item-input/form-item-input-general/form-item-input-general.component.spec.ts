import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputGeneralComponent } from './form-item-input-general.component';
import { MockDebounceDirective } from 'src/app/shared/mocks/unit-test-mocks';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { forwardRef } from '@angular/core';

describe('FormItemInputGeneralComponent', () => {
  let component: FormItemInputGeneralComponent;
  let fixture: ComponentFixture<FormItemInputGeneralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemInputGeneralComponent, MockDebounceDirective],
      imports: [FormsModule],
      providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => FormItemInputGeneralComponent),
          multi: true
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormItemInputGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
