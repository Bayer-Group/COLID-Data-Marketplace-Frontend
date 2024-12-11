import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeComponent } from './welcome.component';
import { NgxsModule } from '@ngxs/store';
import { MatDialogModule } from '@angular/material/dialog';
import { LogService } from 'src/app/core/logging/log.service';
import {
  MockAuthService,
  MockLogService,
  MockReindexApiService,
  MockSearchBarAutocompleteComponent,
  MockSidebarComponent,
  MockWelcomeContentComponent
} from 'src/app/shared/mocks/unit-test-mocks';
import { ReindexApiService } from 'src/app/core/http/reindex.api.service';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        WelcomeComponent,
        MockSidebarComponent,
        MockSearchBarAutocompleteComponent,
        MockWelcomeContentComponent
      ],
      imports: [
        NoopAnimationsModule,
        NgxsModule.forRoot(),
        MatDialogModule,
        MatSidenavModule
      ],
      providers: [
        {
          provide: LogService,
          useClass: MockLogService
        },
        {
          provide: ReindexApiService,
          useClass: MockReindexApiService
        },
        {
          provide: AuthService,
          useClass: MockAuthService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
