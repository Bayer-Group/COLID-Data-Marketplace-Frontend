import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  DATE_FORMAT,
  FilterBoxItemDaterangeComponent
} from './filter-box-item-daterange.component';
import { NgxsModule } from '@ngxs/store';
import { CommonModule, DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  MAT_DATE_LOCALE,
  DateAdapter,
  MAT_DATE_FORMATS
} from '@angular/material/core';

// TODO: needs proper data mocks
xdescribe('FilterBoxItemDaterangeComponent', () => {
  let component: FilterBoxItemDaterangeComponent;
  let fixture: ComponentFixture<FilterBoxItemDaterangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterBoxItemDaterangeComponent],
      imports: [NgxsModule.forRoot(), CommonModule],
      providers: [
        DatePipe,
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterBoxItemDaterangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
