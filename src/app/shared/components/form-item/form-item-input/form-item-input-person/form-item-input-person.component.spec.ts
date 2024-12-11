import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputPersonComponent } from './form-item-input-person.component';
import { forwardRef } from '@angular/core';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { EMPTY } from 'rxjs';
import { PersonApiService } from 'src/app/core/http/person.api.service';
import { NgSelectModule } from '@ng-select/ng-select';

describe('FormItemInputPersonComponent', () => {
  let component: FormItemInputPersonComponent;
  let fixture: ComponentFixture<FormItemInputPersonComponent>;

  class MockPersonApiService {
    searchPerson(term: string) {
      return EMPTY;
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemInputPersonComponent],
      imports: [NgSelectModule, FormsModule, ReactiveFormsModule],
      providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => FormItemInputPersonComponent),
          multi: true
        },
        {
          provide: PersonApiService,
          useClass: MockPersonApiService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormItemInputPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
