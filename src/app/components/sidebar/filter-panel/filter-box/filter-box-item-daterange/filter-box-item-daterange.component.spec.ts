import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBoxItemDaterangeComponent } from './filter-box-item-daterange.component';

describe('FilterBoxItemDaterangeComponent', () => {
  let component: FilterBoxItemDaterangeComponent;
  let fixture: ComponentFixture<FilterBoxItemDaterangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterBoxItemDaterangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterBoxItemDaterangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
