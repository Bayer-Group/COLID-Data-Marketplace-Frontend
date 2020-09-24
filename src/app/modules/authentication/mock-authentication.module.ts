import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockIdentityProvider } from './services/mock-identity-provider.service';
import { IDENT_PROV } from 'src/app/shared/constants';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    { provide: IDENT_PROV, useClass: MockIdentityProvider }
  ]
})
export class MockAuthenticationModule {
  static forRoot(): ModuleWithProviders<MockAuthenticationModule> {
    return {
      ngModule: MockAuthenticationModule,
      providers: [
        { provide: IDENT_PROV, useClass: MockIdentityProvider }
      ]
    };
  }
}