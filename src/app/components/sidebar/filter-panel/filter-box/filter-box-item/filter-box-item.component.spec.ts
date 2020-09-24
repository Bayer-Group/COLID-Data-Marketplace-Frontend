import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBoxItemComponent } from './filter-box-item.component';

describe('FilterBoxItemComponent', () => {
  let component: FilterBoxItemComponent;
  let fixture: ComponentFixture<FilterBoxItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterBoxItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterBoxItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
