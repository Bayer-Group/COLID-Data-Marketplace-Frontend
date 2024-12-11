import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputDistributionComponent } from './form-item-input-distribution.component';
import { forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxsModule } from '@ngxs/store';
import { MockFormComponent } from 'src/app/shared/mocks/unit-test-mocks';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

describe('FormItemInputDistributionComponent', () => {
  let component: FormItemInputDistributionComponent;
  let fixture: ComponentFixture<FormItemInputDistributionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemInputDistributionComponent, MockFormComponent],
      imports: [
        MatDialogModule,
        FormsModule,
        NgxsModule.forRoot(),
        MatCheckboxModule,
        MatButtonModule
      ],
      providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => FormItemInputDistributionComponent),
          multi: true
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormItemInputDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
