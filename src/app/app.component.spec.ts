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
import { EMPTY } from 'rxjs';
import { SetSidebarMode, SetSidebarOpened } from './states/sidebar.state';

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

  it('should toggle navbar', () => {
    const spy = spyOn(component['store'], 'dispatch').and.returnValue(EMPTY);

    component.toggleNavbar();

    expect(spy).toHaveBeenCalled();
  });

  it('should set sidebar mode to OVER when window is resized smaller', () => {
    const spy = spyOn(component['store'], 'dispatch').and.returnValue(EMPTY);

    window.innerWidth = 1;
    window.dispatchEvent(new Event('resize'));

    expect(spy).toHaveBeenCalledWith(new SetSidebarMode('over'));
  });

  it('should set sidebar mode to SIDE when window is resized larger', () => {
    const spy = spyOn(component['store'], 'dispatch').and.returnValue(EMPTY);

    window.innerWidth = 9999;
    window.dispatchEvent(new Event('resize'));

    expect(spy).toHaveBeenCalledWith([
      new SetSidebarMode('side'),
      new SetSidebarOpened(true)
    ]);
  });

  it('should not toggle sidenav for favorites route', () => {
    const spy = spyOn(component['sidenav'], 'open').and.stub();
    component.currentRoute = '/favorite';

    component.toggleSidenav('favorite');

    expect(spy).not.toHaveBeenCalled();
  });

  it('should open sidenav for different type', () => {
    const spy = spyOn(component['sidenav'], 'open').and.stub();

    component.activeSidebar = 'not a test';
    component.openedSidenav = false;

    component.toggleSidenav('test');

    expect(spy).toHaveBeenCalled();
    expect(component.openedSidenav).toBeTrue();
    expect(component.activeSidebar).toBe('test');
  });

  it('should close already opened sidenav for same type', () => {
    const spy = spyOn(component['sidenav'], 'close').and.stub();

    component.activeSidebar = 'test';
    component.openedSidenav = true;

    component.toggleSidenav('test');

    expect(spy).toHaveBeenCalled();
    expect(component.openedSidenav).toBeFalse();
    expect(component.activeSidebar).toBe('test');
  });

  it('should open a closed sidenav for same type', () => {
    const spy = spyOn(component['sidenav'], 'open').and.stub();

    component.activeSidebar = 'test';
    component.openedSidenav = false;

    component.toggleSidenav('test');

    expect(spy).toHaveBeenCalled();
    expect(component.openedSidenav).toBeTrue();
    expect(component.activeSidebar).toBe('test');
  });
});
