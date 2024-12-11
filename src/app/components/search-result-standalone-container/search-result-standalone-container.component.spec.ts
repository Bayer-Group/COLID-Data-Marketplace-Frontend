import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultStandaloneContainerComponent } from './search-result-standalone-container.component';
import { NgxsModule } from '@ngxs/store';
import { mockActivatedRoute } from 'src/app/shared/mocks/unit-test-mocks';
import { ActivatedRoute } from '@angular/router';

// TODO: needs proper route mocks
xdescribe('SearchResultStandaloneContainerComponent', () => {
  let component: SearchResultStandaloneContainerComponent;
  let fixture: ComponentFixture<SearchResultStandaloneContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchResultStandaloneContainerComponent],
      imports: [NgxsModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultStandaloneContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
