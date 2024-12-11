import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultsComponent } from './search-results.component';
import { NgxsModule } from '@ngxs/store';
import {
  mockActivatedRoute,
  MockColidSpinnerComponent,
  MockLogService
} from 'src/app/shared/mocks/unit-test-mocks';
import { ActivatedRoute } from '@angular/router';
import { LogService } from 'src/app/core/logging/log.service';

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchResultsComponent, MockColidSpinnerComponent],
      imports: [NgxsModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        },
        {
          provide: LogService,
          useClass: MockLogService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
