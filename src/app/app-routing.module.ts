import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { HelpComponent } from './components/help/help.component';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';
import { LoggedInComponent } from './shared/components/logged-in/logged-in.component';
import { LoginInProgressComponent } from './shared/components/login-in-progress/login-in-progress.component';
import { AuthGuardService } from './modules/authentication/guards/auth-guard.service';

const welcomeRoute = { path: '', component: WelcomeComponent, canActivate: [AuthGuardService] };
const searchRoute = { path: 'search', component: SearchComponent, canActivate: [AuthGuardService] };
const helpRoute = { path: 'help', component: HelpComponent, canActivate: [AuthGuardService] };

const unauthorizedRoute = { path: 'unauthorized', component: UnauthorizedComponent };
const loggedInRoute = { path: 'logged-in', component: LoggedInComponent };
const loginInProgressRoute = { path: 'login-in-progress', component: LoginInProgressComponent };
const catchAll = { path: '**', redirectTo: '' };

const userPreferencesRoute = {
  path: 'user', loadChildren: () => import('./modules/user-preferences/user-preferences.module').then(m => m.UserPreferencesModule),
  canActivate: [AuthGuardService]
}

const routes: Routes = [
  unauthorizedRoute,
  loggedInRoute,
  loginInProgressRoute,
  welcomeRoute,
  searchRoute,
  helpRoute,
  userPreferencesRoute,
  catchAll
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'ignore' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
