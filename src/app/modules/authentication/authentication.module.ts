import { NgModule, ModuleWithProviders, Provider } from "@angular/core";
import { CommonModule } from "@angular/common";
import { environment } from "src/environments/environment";
import { AuthService } from "./services/auth.service";
import { AuthGuardService } from "./guards/auth-guard.service";
import { MockAuthenticationModule } from "./mock-authentication.module";
import { AzureAuthenticationModule } from "./azure-authentication.module";
import { AuthGuardAdminService } from "./guards/auth-guard-admin.service";
import { AuthGuardSuperAdminService } from "./guards/auth-guard-super-admin.service";
import { EditorPrivilegeGuard } from "./guards/editor-privilege.guard";

export const providers: Provider[] = [
  AuthGuardService,
  AuthService,
  AuthGuardAdminService,
  AuthGuardSuperAdminService,
  EditorPrivilegeGuard,
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    environment.allowAnonymous
      ? MockAuthenticationModule.forRoot()
      : AzureAuthenticationModule.forRoot(),
  ],
  providers: [providers],
  exports: [
    environment.allowAnonymous
      ? MockAuthenticationModule
      : AzureAuthenticationModule,
  ],
})
export class AuthenticationModule {
  static forRoot(): ModuleWithProviders<AuthenticationModule> {
    return {
      ngModule: AuthenticationModule,
      providers: [providers],
    };
  }
}
