import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { NgxsModule } from '@ngxs/store';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  mockActivatedRoute,
  MockAuthService,
  MockClusteringWrapperComponent,
  MockColidMatSnackBarService,
  MockExportService,
  MockLogService,
  MockSearchBarAutocompleteComponent,
  MockSearchResultComponent,
  MockSidebarComponent
} from 'src/app/shared/mocks/unit-test-mocks';
import { MatDialogModule } from '@angular/material/dialog';
import { CookieModule, CookieService } from 'ngx-cookie';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { ExportService } from 'src/app/core/http/export.service';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { LogService } from 'src/app/core/logging/log.service';

// TODO: needs proper route mocks
xdescribe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchComponent,
        MockClusteringWrapperComponent,
        MockSidebarComponent,
        MockSearchBarAutocompleteComponent,
        MockSearchResultComponent
      ],
      imports: [
        NgxsModule.forRoot(),
        MatDialogModule,
        CookieModule.withOptions(),
        RouterModule
      ],
      providers: [
        CookieService,
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        },
        {
          provide: ColidMatSnackBarService,
          useClass: MockColidMatSnackBarService
        },
        {
          provide: ExportService,
          useClass: MockExportService
        },
        {
          provide: AuthService,
          useClass: MockAuthService
        },
        {
          provide: LogService,
          useClass: MockLogService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
