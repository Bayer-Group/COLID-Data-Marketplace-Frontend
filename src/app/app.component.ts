import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { FetchBuildInformation } from './states/status.state';
import { MetadataState, FetchMetadata } from './states/metadata.state';
import { Observable, of, Subscription } from 'rxjs';
import {
  SetSidebarMode,
  ToggleSidebar,
  SetSidebarOpened
} from './states/sidebar.state';
import { EnsureBrowserSupportService } from './modules/browser-support/services/ensure-browser-support.service';
import { ColidIconsService } from './modules/colid-icons/services/colid-icons.service';
import { CustomMaterialIcon } from './modules/colid-icons/models/custom-material-icon';
import {
  SetLastLoginDataMarketplace,
  FetchUser,
  FetchConsumerGroupsByUser,
  FetchLatestSubscriptions,
  FetchMostSubscribedResources
} from './states/user-info.state';
import { AuthService } from './modules/authentication/services/auth.service';
import { FetchNotifications } from './modules/notification/notification.state';
import { map, switchMap } from 'rxjs/operators';
import { FetchFavorites } from './components/favorites/favorites.state';
import { MatSidenav } from '@angular/material/sidenav';
import { Event, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('notificationSidenav') sidenav: MatSidenav;
  @Select(MetadataState.getMetadataTypes) metadataTypes$: Observable<any>;

  activeSidebar: string = 'notification';
  openedSidenav: boolean = false;
  currentRoute: string = '';

  masterSub: Subscription = new Subscription();

  constructor(
    private browserSupport: EnsureBrowserSupportService,
    private store: Store,
    public authService: AuthService,
    private iconService: ColidIconsService,
    private router: Router
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

  ngOnInit() {
    this.masterSub.add(
      this.authService.isLoggedIn$.subscribe((isAuth) => {
        if (isAuth) {
          if (this.browserSupport.isSupported()) {
            this.store
              .dispatch([new FetchBuildInformation(), new FetchMetadata()])
              .subscribe((res) => console.log(res));
          }
        }
      })
    );

    this.masterSub.add(
      this.authService.isLoggedIn$
        .pipe(
          switchMap((isAuth) => {
            return isAuth ? this.authService.currentIdentity$ : of(null);
          })
        )
        .pipe(
          switchMap((identity) => {
            if (identity) {
              console.log('Account identifier is', identity.accountIdentifier);
              return this.store.dispatch([
                new FetchUser(identity.accountIdentifier, identity.email),
                new FetchNotifications(identity.accountIdentifier),
                new FetchLatestSubscriptions(identity.accountIdentifier),
                new FetchMostSubscribedResources(),
                new FetchFavorites(identity.accountIdentifier),
                new FetchConsumerGroupsByUser(),
                new SetLastLoginDataMarketplace()
              ]);
            } else {
              return of(null);
            }
          })
        )
        .subscribe()
    );

    this.masterSub.add(
      this.metadataTypes$.subscribe((metadataTypes) => {
        if (metadataTypes) {
          var icons = metadataTypes.map((metadataType) => {
            const key = metadataType.id;
            const url = metadataType.id;
            const toolTip = metadataType.name;

            return new CustomMaterialIcon(key, url, toolTip);
          });

          this.iconService.registerColidIcons(icons);
        }
      })
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setSidebarMode(event.target);
  }

  get currentAccountIdentifier$(): Observable<string> {
    return this.authService.currentIdentity$.pipe(
      map((identity) => (identity ? identity.accountIdentifier : null))
    );
  }

  setSidebarMode(window: Window) {
    if (window.innerWidth < 1000) {
      this.store.dispatch(new SetSidebarMode('over')).subscribe();
    } else {
      this.store
        .dispatch([new SetSidebarMode('side'), new SetSidebarOpened(true)])
        .subscribe();
    }
  }

  toggleSidenav(type: string) {
    if (type === 'favorite' && this.currentRoute.startsWith('/favorite')) {
      return;
    }
    //when sidenav type is changed
    if (this.activeSidebar != type) {
      this.activeSidebar = type;
      if (!this.openedSidenav) {
        this.openedSidenav = !this.openedSidenav;
      }
    } else {
      this.openedSidenav = !this.openedSidenav;
    }

    if (this.openedSidenav) {
      this.sidenav.open();
    } else {
      this.sidenav.close();
    }
  }

  toggleNavbar() {
    this.store.dispatch(new ToggleSidebar()).subscribe();
  }

  ngOnDestroy(): void {
    this.masterSub.unsubscribe();
    this.authService.cleanup();
  }
}
