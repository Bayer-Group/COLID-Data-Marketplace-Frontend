import { Component, OnInit, HostListener } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { FetchBuildInformation } from './states/status.state';
import { MetadataState, FetchMetadata } from './states/metadata.state';
import { Observable } from 'rxjs';
import { SetSidebarMode, ToggleSidebar, SetSidebarOpened } from './states/sidebar.state';
import { CheckForUpdateService } from './shared/services/update/check-for-update.service';
import { PromptUpdateService } from './shared/services/update/prompt-update.service';
import { EnsureBrowserSupportService } from './modules/browser-support/services/ensure-browser-support.service';
import { ColidIconsService } from './modules/colid-icons/services/colid-icons.service';
import { CustomMaterialIcon } from './modules/colid-icons/models/custom-material-icon';
import { SetLastLoginDataMarketplace, FetchUser } from './states/user-info.state';
import { AuthService } from './modules/authentication/services/auth.service';
import { FetchNotifications } from './modules/notification/notification.state'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @Select(MetadataState.getMetadataTypes) metadataTypes$: Observable<any>

  constructor(
    private browserSupport: EnsureBrowserSupportService,
    private checkForUpdateService: CheckForUpdateService,
    private promptUpdateService: PromptUpdateService,
    private store: Store,
    public authService: AuthService,
    private iconService: ColidIconsService) {
  }

  ngOnInit() {
    if (this.browserSupport.isSupported()) {
      this.store.dispatch([new FetchBuildInformation, new FetchMetadata]).subscribe(res => console.log(res));
    }

    if (this.authService.isAuthorized) {
      const identity = this.authService.currentIdentity;
      this.store.dispatch([new FetchUser(identity.accountIdentifier, identity.email),new FetchNotifications(identity.accountIdentifier)]).subscribe(() => {
        this.store.dispatch(new SetLastLoginDataMarketplace()).subscribe();
      });
    }

    this.metadataTypes$.subscribe(metadataTypes => {
      if (metadataTypes) {
        var icons = metadataTypes.map(metadataType => {
          console.log('Created custom material icon:' + metadataType);
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
