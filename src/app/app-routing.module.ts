import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';
import { LoggedInComponent } from './shared/components/logged-in/logged-in.component';
import { LoginInProgressComponent } from './shared/components/login-in-progress/login-in-progress.component';
import { AuthGuardService } from './modules/authentication/guards/auth-guard.service';
import { AuthGuardAdminService } from './modules/authentication/guards/auth-guard-admin.service';
import { SearchResultStandaloneContainerComponent } from './components/search-result-standalone-container/search-result-standalone-container.component';
import { FavoritesOpenComponent } from './components/favorites/components/favorites-open/favorites-open.component';
import { ResourceReviewsComponent } from './components/resource-reviews/resource-reviews.component';
import { EditorPrivilegeGuard } from './modules/authentication/guards/editor-privilege.guard';

const welcomeRoute = {
  path: '',
  component: WelcomeComponent,
  canActivate: [AuthGuardService]
};
const searchRoute = {
  path: 'search',
  component: SearchComponent,
  canActivate: [AuthGuardService]
};
const detailRoute = {
  path: 'resource-detail',
  component: SearchResultStandaloneContainerComponent,
  canActivate: [AuthGuardService]
};
const favoritesRoute = {
  path: 'favorites',
  component: FavoritesOpenComponent,
  canActivate: [AuthGuardService]
};
const unauthorizedRoute = {
  path: 'unauthorized',
  component: UnauthorizedComponent
};
const loggedInRoute = { path: 'logged-in', component: LoggedInComponent };
const loginInProgressRoute = {
  path: 'login-in-progress',
  component: LoginInProgressComponent
};
const catchAll = { path: '**', redirectTo: '' };

const userPreferencesRoute = {
  path: 'user',
  loadChildren: () =>
    import('./modules/user-preferences/user-preferences.module').then(
      (m) => m.UserPreferencesModule
    ),
  canActivate: [AuthGuardService]
};

const resourceReviewsRoute = {
  path: 'resource-reviews',
  component: ResourceReviewsComponent,
  canActivate: [EditorPrivilegeGuard]
};

const adminRoute = {
  path: 'admin',
  loadChildren: () =>
    import('./modules/admin/admin.module').then((m) => m.AdminModule),
  canActivate: [AuthGuardAdminService]
};

const routes: Routes = [
  unauthorizedRoute,
  loggedInRoute,
  loginInProgressRoute,
  welcomeRoute,
  searchRoute,
  detailRoute,
  favoritesRoute,
  userPreferencesRoute,
  resourceReviewsRoute,
  adminRoute,
  catchAll
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'ignore'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
