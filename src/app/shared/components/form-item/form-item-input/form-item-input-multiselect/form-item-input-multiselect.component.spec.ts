import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputMultiselectComponent } from './form-item-input-multiselect.component';
import { NgxsModule } from '@ngxs/store';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

describe('FormItemInputMultiselectComponent', () => {
  let component: FormItemInputMultiselectComponent;
  let fixture: ComponentFixture<FormItemInputMultiselectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemInputMultiselectComponent],
      imports: [
        NgxsModule.forRoot([]),
        MatDialogModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormItemInputMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
