import { Component, OnInit, HostListener } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { FetchBuildInformation } from './states/status.state';
import { MetadataState, FetchMetadata } from './states/metadata.state';
import { Observable, of, Subject } from 'rxjs';
import { SetSidebarMode, ToggleSidebar, SetSidebarOpened } from './states/sidebar.state';
import { EnsureBrowserSupportService } from './modules/browser-support/services/ensure-browser-support.service';
import { ColidIconsService } from './modules/colid-icons/services/colid-icons.service';
import { CustomMaterialIcon } from './modules/colid-icons/models/custom-material-icon';
import { SetLastLoginDataMarketplace, FetchUser } from './states/user-info.state';
import { AuthService } from './modules/authentication/services/auth.service';
import { FetchNotifications } from './modules/notification/notification.state'
import { map, switchMap, tap } from 'rxjs/operators';
import { RRMState } from './states/rrm.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @Select(MetadataState.getMetadataTypes) metadataTypes$: Observable<any>;
  @Select(RRMState.getFromRRM) hideToolbar$: Observable<boolean>;
  hideToolbar: boolean = false;
  private readonly _destroying$ = new Subject<void>();
  constructor(
    private browserSupport: EnsureBrowserSupportService,
    private store: Store,
    public authService: AuthService,
    private iconService: ColidIconsService) {
    this.hideToolbar$.pipe(
      tap(
        s => {
          this.hideToolbar = s;
        }
      )
    ).subscribe();
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isAuth => {
      if (isAuth) {
        if (this.browserSupport.isSupported()) {
          this.store.dispatch([new FetchBuildInformation, new FetchMetadata]).subscribe(res => console.log(res));
        }
      }
    })

    /*
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status===InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => ){
        this.azuraIdentityProvider.setLoginDisplay();
        this.azuraIdentityProvider.checkAndSetAkivAccount();
      }

    /* //in the guid this was the snippet but belonges in Azure-identity-provider instead
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus)=> status ===InteractionStatus.None),
        takeUntil(this._destroying$)
      )
        .subscribe(()=> {
          this.setLoginDisplay();
          this.checkAndSetActiveAccount();
        })
      */


    this.authService.isLoggedIn$.pipe(switchMap(isAuth => {
      return isAuth ? this.authService.currentIdentity$ : of(null)
    })
    ).pipe(switchMap(identity => {
      if (identity) {
        return this.store.dispatch([new FetchUser(identity.accountIdentifier, identity.email), new FetchNotifications(identity.accountIdentifier)])
      }
    })).pipe(switchMap(() => {
      return this.store.dispatch(new SetLastLoginDataMarketplace());
    })).subscribe();

    this.metadataTypes$.subscribe(metadataTypes => {
      if (metadataTypes) {
        var icons = metadataTypes.map(metadataType => {
          const key = metadataType.id;
          const url = metadataType.id;
          const toolTip = metadataType.name;

          return new CustomMaterialIcon(key, url, toolTip);
        });

        this.iconService.registerColidIcons(icons);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setSidebarMode(event.target);
  }

  get currentAccountIdentifier$(): Observable<string> {
    return this.authService.currentIdentity$.pipe(map(identity => identity ? identity.accountIdentifier : null));
  }

  setSidebarMode(window: Window) {
    if (window.innerWidth < 1000) {
      this.store.dispatch(new SetSidebarMode('over')).subscribe();
    } else {
      this.store.dispatch([new SetSidebarMode('side'), new SetSidebarOpened(true)]).subscribe();
    }
  }

  toggleNavbar() {
    this.store.dispatch(new ToggleSidebar()).subscribe();
  }
}
