import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultLinkTypeComponent } from './search-result-link-type.component';

describe('SearchResultLinkTypeComponent', () => {
  let component: SearchResultLinkTypeComponent;
  let fixture: ComponentFixture<SearchResultLinkTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResultLinkTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultLinkTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
