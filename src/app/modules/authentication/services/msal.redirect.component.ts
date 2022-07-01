// This component is part of @azure/msal-angular and can be imported and bootstrapped
import { Component, OnInit } from "@angular/core";
import { MsalBroadcastService, MsalService } from "@azure/msal-angular";

@Component({
  selector: 'app-redirect', // Selector to be added to index.html
  template: ''
})
export class MsalRedirectComponent implements OnInit {
    loginDisplay=false;
  
  constructor(private authService: MsalService, private msalBroadcast: MsalBroadcastService) { }
  
  ngOnInit(): void {    
      this.authService.getLogger().verbose("MsalRedirctCoponent Activated");
      this.authService.handleRedirectObservable().subscribe();
  }
  
}