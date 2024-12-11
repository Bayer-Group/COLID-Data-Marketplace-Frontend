import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputNestedComponent } from './form-item-input-nested.component';
import { MatDialogModule } from '@angular/material/dialog';
import {
  MockFormComponent,
  MockFormService
} from 'src/app/shared/mocks/unit-test-mocks';
import { FormService } from 'src/app/shared/services/form.service';
import { forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

describe('FormItemInputNestedComponent', () => {
  let component: FormItemInputNestedComponent;
  let fixture: ComponentFixture<FormItemInputNestedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemInputNestedComponent, MockFormComponent],
      imports: [MatDialogModule, MatButtonModule],
      providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => FormItemInputNestedComponent),
          multi: true
        },
        {
          provide: FormService,
          useClass: MockFormService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormItemInputNestedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
