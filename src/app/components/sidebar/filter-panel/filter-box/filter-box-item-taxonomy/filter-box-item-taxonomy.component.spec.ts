import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBoxItemTaxonomyComponent } from './filter-box-item-taxonomy.component';

describe('FilterBoxItemTaxonomyComponent', () => {
  let component: FilterBoxItemTaxonomyComponent;
  let fixture: ComponentFixture<FilterBoxItemTaxonomyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterBoxItemTaxonomyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterBoxItemTaxonomyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
