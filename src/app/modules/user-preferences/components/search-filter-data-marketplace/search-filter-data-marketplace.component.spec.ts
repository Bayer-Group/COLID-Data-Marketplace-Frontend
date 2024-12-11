import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFilterDataMarketplaceComponent } from './search-filter-data-marketplace.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';

describe('SearchFilterDataMarketplaceComponent', () => {
  let component: SearchFilterDataMarketplaceComponent;
  let fixture: ComponentFixture<SearchFilterDataMarketplaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchFilterDataMarketplaceComponent],
      imports: [NoopAnimationsModule, NgxsModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFilterDataMarketplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
