import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockIdentityProvider } from './services/mock-identity-provider.service';
import { IDENT_PROV } from 'src/app/shared/constants';
import { MSAL_INSTANCE } from '@azure/msal-angular';
import { MSALInstanceFactory } from './azure-authentication.module';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    { provide: IDENT_PROV, useClass: MockIdentityProvider },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    }
  ]
})
export class MockAuthenticationModule {
  static forRoot(): ModuleWithProviders<MockAuthenticationModule> {
    return {
      ngModule: MockAuthenticationModule,
      providers: [{ provide: IDENT_PROV, useClass: MockIdentityProvider }]
    };
  }
}
