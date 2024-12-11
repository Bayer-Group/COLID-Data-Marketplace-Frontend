import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { EnsureBrowserSupportService } from './modules/browser-support/services/ensure-browser-support.service';
import { NgxsModule } from '@ngxs/store';
import { AuthService } from './modules/authentication/services/auth.service';
import { AppRoutingModule } from './app-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ColidIconsService } from './modules/colid-icons/services/colid-icons.service';
import {
  MockBrowserSupportComponent,
  MockNavbarComponent,
  MockNotificationComponent,
  MockFavoritesComponent,
  MockAdminComponent,
  MockEnsureBrowserSupportService,
  MockAuthService,
  MockColidIconsService
} from './shared/mocks/unit-test-mocks';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockBrowserSupportComponent,
        MockNavbarComponent,
        MockNotificationComponent,
        MockFavoritesComponent,
        MockAdminComponent
      ],
      imports: [
        NoopAnimationsModule,
        NgxsModule.forRoot(),
        AppRoutingModule,
        MatSidenavModule
      ],
      providers: [
        {
          provide: EnsureBrowserSupportService,
          useClass: MockEnsureBrowserSupportService
        },
        {
          provide: AuthService,
          useClass: MockAuthService
        },
        {
          provide: ColidIconsService,
          useClass: MockColidIconsService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
