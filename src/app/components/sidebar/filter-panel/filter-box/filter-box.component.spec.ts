import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBoxComponent } from './filter-box.component';
import { NgxsModule } from '@ngxs/store';

describe('FilterBoxComponent', () => {
  let component: FilterBoxComponent;
  let fixture: ComponentFixture<FilterBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterBoxComponent],
      imports: [NgxsModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
