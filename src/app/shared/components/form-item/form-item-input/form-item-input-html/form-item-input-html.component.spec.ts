import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputHtmlComponent } from './form-item-input-html.component';
import { MockFormItemInputBaseComponent } from 'src/app/shared/mocks/unit-test-mocks';
import { forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { CommonModule } from '@angular/common';

describe('FormItemInputHtmlComponent', () => {
  let component: FormItemInputHtmlComponent;
  let fixture: ComponentFixture<FormItemInputHtmlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormItemInputHtmlComponent,
        MockFormItemInputBaseComponent
      ],
      imports: [CommonModule, QuillModule, FormsModule],
      providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => FormItemInputHtmlComponent),
          multi: true
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormItemInputHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
