import { NgModule, ModuleWithProviders, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AzureIdentityProvider } from './services/azure-identity-provider.service';
import { IDENT_PROV } from 'src/app/shared/constants';

// Msal
import { Configuration } from 'msal';
import {
  MsalModule,
  MsalInterceptor,
  MsalService,
  MsalAngularConfiguration,
  MSAL_CONFIG,
  MSAL_CONFIG_ANGULAR
} from '@azure/msal-angular';

// checks if the app is running on IE
export const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

export function MSALConfigFactory(): Configuration {
  return {
    auth: {
      clientId: environment.adalConfig.clientId,
      authority: environment.adalConfig.authority,
      validateAuthority: true,
      redirectUri: environment.adalConfig.redirectUri,
      postLogoutRedirectUri: environment.adalConfig.postLogoutRedirectUri,
      navigateToLoginRequestUrl: false,
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
  };
}

export function MSALAngularConfigFactory(): MsalAngularConfiguration {
  return {
    popUp: false,
    consentScopes: ["openid", "profile", "email"],
    protectedResourceMap: new Map(Object.entries(environment.adalConfig.protectedResourceMap)),
    unprotectedResources: [],
    extraQueryParameters: {}
  };
}

const providers: Provider[] = [
  MsalService,
  {
    provide: IDENT_PROV,
    useClass: AzureIdentityProvider
  },
  {
    provide: MSAL_CONFIG,
    useFactory: MSALConfigFactory
  },
  {
    provide: MSAL_CONFIG_ANGULAR,
    useFactory: MSALAngularConfigFactory
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: MsalInterceptor, multi: true
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MsalModule,
  ],
  providers: providers,
  exports: [
    MsalModule
  ]
})
export class AzureAuthenticationModule {
  static forRoot(): ModuleWithProviders<AzureAuthenticationModule> {
    return {
      ngModule: AzureAuthenticationModule,
      providers: providers
    };
  }
}