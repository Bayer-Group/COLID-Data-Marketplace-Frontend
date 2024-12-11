import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBoxItemSwitchComponent } from './filter-box-item-switch.component';
import { FormsModule } from '@angular/forms';

describe('FilterBoxItemSwitchComponent', () => {
  let component: FilterBoxItemSwitchComponent;
  let fixture: ComponentFixture<FilterBoxItemSwitchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterBoxItemSwitchComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterBoxItemSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
