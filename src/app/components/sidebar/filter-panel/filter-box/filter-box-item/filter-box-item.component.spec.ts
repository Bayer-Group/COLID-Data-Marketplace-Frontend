import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBoxItemComponent } from './filter-box-item.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

describe('FilterBoxItemComponent', () => {
  let component: FilterBoxItemComponent;
  let fixture: ComponentFixture<FilterBoxItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterBoxItemComponent],
      imports: [MatCheckboxModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterBoxItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
