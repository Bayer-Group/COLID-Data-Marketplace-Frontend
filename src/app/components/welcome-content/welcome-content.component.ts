import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { FetchSearchFilterDataMarketplace } from 'src/app/states/user-info.state';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';

@Component({
  selector: 'app-welcome-content',
  templateUrl: './welcome-content.component.html',
  styleUrls: ['./welcome-content.component.scss']
})
export class WelcomeContentComponent implements OnInit {
  lastChangedResourceTilesExpanded: boolean = true;

  searchText: string = '*';
  constructor(
    private sanitizer: DomSanitizer,
    private store: Store,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new FetchSearchFilterDataMarketplace());
  }

  get hasCreatePrivilege$(): Observable<boolean> {
    return this.authService.hasCreatePrivilege$;
  }

  setExpansionStatus(expanded: boolean) {
    this.lastChangedResourceTilesExpanded = expanded;
  }

  transformYourHtml(htmlTextWithStyle) {
    return this.sanitizer.bypassSecurityTrustHtml(htmlTextWithStyle);
  }
}
