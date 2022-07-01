import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultStandaloneContainerComponent } from './search-result-standalone-container.component';

describe('SearchResultStandaloneContainerComponent', () => {
  let component: SearchResultStandaloneContainerComponent;
  let fixture: ComponentFixture<SearchResultStandaloneContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchResultStandaloneContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultStandaloneContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
