import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFilterDataMarketplaceComponent } from './search-filter-data-marketplace.component';

describe('SearchFilterDataMarketplaceComponent', () => {
  let component: SearchFilterDataMarketplaceComponent;
  let fixture: ComponentFixture<SearchFilterDataMarketplaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFilterDataMarketplaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFilterDataMarketplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
