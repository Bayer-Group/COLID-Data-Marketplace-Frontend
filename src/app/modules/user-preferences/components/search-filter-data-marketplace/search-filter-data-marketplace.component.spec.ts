import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchFilterDataMarketplaceComponent } from './search-filter-data-marketplace.component';

describe('SearchFilterDataMarketplaceComponent', () => {
  let component: SearchFilterDataMarketplaceComponent;
  let fixture: ComponentFixture<SearchFilterDataMarketplaceComponent>;

  beforeEach(waitForAsync(() => {
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
