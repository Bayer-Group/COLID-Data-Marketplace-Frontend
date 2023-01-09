import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { environment } from '../environments/environment';

// Internal modules
import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './app-material.module';

// Components
import { AppComponent } from './app.component';
import { FilterPanelComponent } from './components/sidebar/filter-panel/filter-panel.component';
import { FilterBoxComponent } from './components/sidebar/filter-panel/filter-box/filter-box.component';
import { FilterBoxItemComponent } from './components/sidebar/filter-panel/filter-box/filter-box-item/filter-box-item.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { SearchComponent } from './components/search/search.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { LoggedInComponent } from './shared/components/logged-in/logged-in.component';
import { LoginInProgressComponent } from './shared/components/login-in-progress/login-in-progress.component';
import { SearchBarAutocompleteComponent } from './components/search-bar-autocomplete/search-bar-autocomplete.component';

// Modules
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { QuillModule, QuillConfig } from "ngx-quill";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faTimes,
  faPlus,
  faMinus,
  faUndo,
  faCartPlus,
  faQuestionCircle,
  faShareAlt,
  faDatabase,
  faSuperscript,
  faVectorSquare,
  faInfoCircle,
  faTools,
  faCheck,
  faBullhorn,
  faComment,
  faQuestion
} from '@fortawesome/free-solid-svg-icons';

import {
  faLightbulb,
  faFileAlt,
  faWindowMaximize,
  faFile,
  faPlusSquare,
  faMinusSquare
} from '@fortawesome/free-regular-svg-icons';

library.add(
  faPlus,
  faPlusSquare,
  faMinus,
  faMinusSquare,
  faTimes,
  faUndo,
  faCartPlus,
  faQuestionCircle,
  faLightbulb,
  faFileAlt,
  faShareAlt,
  faDatabase,
  faSuperscript,
  faVectorSquare,
  faInfoCircle,
  faTools,
  faWindowMaximize,
  faFile,
  faCheck,
  faBullhorn,
  faComment,
  faQuestion
);

// Services
import { LogService } from './core/logging/log.service';

// States
import { FilterState } from './states/filter.state';
import { SearchState } from './states/search.state';
import { StatusState } from './states/status.state';
import { MetadataState } from './states/metadata.state';
import { SidebarState } from './states/sidebar.state';
import { UserInfoState } from './states/user-info.state';
import { WelcomeMessageState } from './states/welcome-message.state'
import { ColidEntrySubscriberCountState } from './states/colid-entry-subcriber-count.state'
import { TaxonomyState } from "./states/taxonomy.state";

// Provider
import { DatePipe } from '@angular/common';
import { GlobalErrorHandler } from './core/logging/error.handler';
import { LogPublishersService } from './core/logging/log-publishers.service';
import { DebounceDirective } from './shared/directives/debounce.directive';
import { FilterBoxItemSwitchComponent } from './components/sidebar/filter-panel/filter-box/filter-box-item-switch/filter-box-item-switch.component';
import { FilterBoxItemDaterangeComponent } from './components/sidebar/filter-panel/filter-box/filter-box-item-daterange/filter-box-item-daterange.component';
import { WelcomeContentComponent } from './components/welcome-content/welcome-content.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { HelpComponent } from './components/help/help.component';
import { StatusApiService } from './core/http/status.api.service';
import { WelcomeMessageApiService } from './core/http/welcome-message.api.sevice';

import { DistributionEndpointComponent } from './components/search-result/distribution-endpoint/distribution-endpoint.component';
import { RangeBoxComponent } from './components/sidebar/filter-panel/range-box/range-box.component';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';
import { MetadataService } from './core/http/metadata.service';
import { SearchService } from './core/http/search.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchResultLinkTypeComponent } from './components/search-result/search-result-link-type/search-result-link-type.component';
import { SupportFeedbackBarComponent } from './shared/components/support-feedback-bar/support-feedback-bar.component';
import { HighlightPipe } from './shared/pipes/highlight.pipe';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DocumentService } from './core/http/document.service';
import { LinkedResourceDisplayDialog } from './components/linked-resource-dialog/linked-resource-display-dialog.component';
import { FilterBoxItemTaxonomyComponent } from './components/sidebar/filter-panel/filter-box/filter-box-item-taxonomy/filter-box-item-taxonomy.component';
import { UserInfoApiService } from './core/http/user-info.api.service';
import { ColidSnackBarModule } from './modules/colid-mat-snack-bar/colid-mat-snack-bar.module';
import { ColidDefaultInterceptor } from './core/interceptors/colid-default.interceptor';
import { ColidIconsModule } from './modules/colid-icons/colid-icons.module';
import { BrowserSupportModule } from './modules/browser-support/browser-support.module';
import { SimilarityModalComponent } from './components/search-result/similarity-modal/similarity-modal.component';
import { ResourceApiService } from './core/http/resource.api.service';
import { ColidEntrySubscriptionsState } from './states/colid-entry-subscription.state';
import { SharedModule } from './shared/shared-module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { NotificationModule } from './modules/notification/notification.module';

import { SearchResultAttachmentComponent } from './components/search-result/search-result-attachment/search-result-attachment.component';
import { ImageViewerDialogComponent } from './shared/components/image-viewer-dialog/image-viewer-dialog.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { ResourcePoliciesComponent } from './components/search-result/resource-policies/resource-policies.component';
import { ResourcePoliciesState } from './states/resource-policies.state';
import { JoinPipe } from './shared/pipes/join.pipe';
import { SearchFilterDialogComponent } from './components/sidebar/search-filter-dialog/search-filter-dialog.component';
import { ExportDialogComponent } from './components/export-dialog/export-dialog.component';
import { RRMState } from './states/rrm.state';
import { SearchResultStandaloneContainerComponent } from './components/search-result-standalone-container/search-result-standalone-container.component';
import { SchemeUIComponent } from './components/search-result/scheme-ui/scheme-ui.component';
import { MultiselectWarningDialogComponent } from './components/multiselect-warning-dialog/multiselect-warning-dialog.component';
import { ColumnsNamePipe } from './shared/pipes/columnsName.pipe';
import { MsalBroadcastService, MsalGuard, MsalModule, MsalService } from '@azure/msal-angular';
import { MsalRedirectComponent } from './modules/authentication/services/msal.redirect.component';
import { FilterBoxItemCheckboxHierarchyComponent } from './components/sidebar/filter-panel/filter-box/filter-box-checkboxHierarchy/filter-box-item-checkboxHierarchy.component';
import { BrowserCacheLocation, InteractionType, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { isIE, loggerCallback } from './modules/authentication/azure-authentication.module';
import { FavoritesState } from './components/favorites/favorites.state';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { CreateFavoriteListComponent } from './components/favorites/components/create-favorite-list/create-favorite-list.component';
import { EditFavoriteListComponent } from './components/favorites/components/edit-favorite-list/edit-favorite-list.component';
import { AddFavoriteDialogComponent } from './components/favorites/components/add-favorite-dialog/add-favorite-dialog.component';
import { DeleteFavoriteListComponent } from './components/favorites/components/delete-favorite-list/delete-favorite-list.component';
import { RemoveFavoriteEntryComponent } from './components/favorites/components/remove-favorite-entry/remove-favorite-entry.component';
import { EditFavoriteEntryComponent } from './components/favorites/components/edit-favorite-entry/edit-favorite-entry.component';
import { FavoritesOpenComponent } from './components/favorites/components/favorites-open/favorites-open.component';
import { FavoritesService } from './components/favorites/services/favorites.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingIndicatorPipe } from './shared/pipes/loadingIndicator.pipe';
import { MapPipe } from "./shared/pipes/map.pipe";

import { ResourceReviewsComponent } from './components/resource-reviews/resource-reviews.component';
import { ReviewCyclePipe } from './shared/pipes/review-cycle.pipe';
import { ReviewState } from './states/review.state';
import { BypassSanitizerPipe } from './shared/pipes/bypassSanitizer.pipe';
import { ResourceHistoricComponent } from './components/resource-historic/resource-historic.component';
import { EntityDisplayComponent } from './components/entity-display/entity-display.component';
import { EntityDisplayImageComponent } from './components/entity-display/entity-display-image/entity-display-image.component';
import { EntityDisplayGroupComponent } from './components/entity-display/entity-display-group/entity-display-group.component';
import { EntityDisplayItemComponent } from './components/entity-display/entity-display-item/entity-display-item.component';
import { EntityDisplayItemTaxonomyComponent } from './components/entity-display/entity-display-item-taxonomy/entity-display-item-taxonomy.component';
import { EntityDisplayItemVersioningComponent } from './components/entity-display/entity-display-item-versioning/entity-display-item-versioning.component';
import { FavoriteListComponent } from './components/favorites/components/favorite-list/favorite-list.component';
import { CookieModule } from 'ngx-cookie';

// Global quill config for form items
const globalQuillConfig: QuillConfig = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      ['clean'],                                        // remove formatting button
      ['link']                                          // link
    ]
  }
}

const states = [
  FilterState,
  SearchState,
  StatusState,
  MetadataState,
  SidebarState,
  UserInfoState,
  RRMState,
  WelcomeMessageState,
  ColidEntrySubscriberCountState,
  ColidEntrySubscriptionsState,
  ResourcePoliciesState,
  FavoritesState,
  ReviewState,
  TaxonomyState,
];
const protectedResourceMap = new Map(Object.entries(environment.adalConfig.protectedResourceMap));
declare module "@angular/core" {
  interface ModuleWithProviders<T = any> {
    ngModule: Type<T>;
    providers?: Provider[];
  }
}

@NgModule({
  declarations: [
    AppComponent,
    MsalRedirectComponent,
    FilterPanelComponent,
    FilterBoxComponent,
    FilterBoxItemComponent,
    SidebarComponent,
    NavbarComponent,
    WelcomeComponent,
    SearchComponent,
    SearchBarComponent,
    SearchResultsComponent,
    LoggedInComponent,
    LoginInProgressComponent,
    DebounceDirective,
    SearchBarAutocompleteComponent,
    FilterBoxItemSwitchComponent,
    FilterBoxItemDaterangeComponent,
    WelcomeContentComponent,
    SearchResultComponent,
    HelpComponent,
    SearchResultStandaloneContainerComponent,
    DistributionEndpointComponent,
    SearchResultAttachmentComponent,
    RangeBoxComponent,
    UnauthorizedComponent,
    SearchResultLinkTypeComponent,
    SupportFeedbackBarComponent,
    LinkedResourceDisplayDialog,
    ExportDialogComponent,
    HighlightPipe,
    JoinPipe,
    MapPipe,
    ColumnsNamePipe,
    BypassSanitizerPipe,
    LoadingIndicatorPipe,
    FilterBoxItemTaxonomyComponent,
    FilterBoxItemCheckboxHierarchyComponent,
    ImageViewerDialogComponent,
    SimilarityModalComponent,
    FeedbackComponent,
    ResourcePoliciesComponent,
    SearchFilterDialogComponent,
    SchemeUIComponent,
    MultiselectWarningDialogComponent, 
    FavoritesComponent,
    CreateFavoriteListComponent,
    EditFavoriteListComponent,
    AddFavoriteDialogComponent,
    DeleteFavoriteListComponent,
    RemoveFavoriteEntryComponent,
    EditFavoriteEntryComponent,
    FavoritesOpenComponent,
    ResourceReviewsComponent,
    ReviewCyclePipe,
    ResourceHistoricComponent,
    EntityDisplayComponent,
    EntityDisplayImageComponent,
    EntityDisplayGroupComponent,
    EntityDisplayItemComponent,
    EntityDisplayItemTaxonomyComponent,
    EntityDisplayItemVersioningComponent,
    FavoriteListComponent
  ],
  imports: [
    MsalModule.forRoot(new PublicClientApplication({//MSAL Config
      auth: {
        clientId: environment.adalConfig.clientId,
        authority: environment.adalConfig.authority,
        redirectUri: environment.adalConfig.redirectUri,
        postLogoutRedirectUri: environment.adalConfig.postLogoutRedirectUri,
        navigateToLoginRequestUrl: false,
      },
      cache: {
        cacheLocation: BrowserCacheLocation.SessionStorage,
        storeAuthStateInCookie: isIE, // set to true for IE 11
      },
      system: {
        loggerOptions: {
          loggerCallback,
          logLevel: LogLevel.Info,
          piiLoggingEnabled: false
        },
        allowRedirectInIframe: true,
      }
    }), {//MSAL GUard Config
      interactionType: InteractionType.Redirect,
      authRequest: {
        scopes: ["user.read", "openid", "profile", "email"]
      },
      loginFailedRoute: "/login-failed"
    }, {

      interactionType: InteractionType.Redirect,
      protectedResourceMap
    }),
    TypeaheadModule.forRoot(),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AppMaterialModule,
    HttpClientModule,
    FontAwesomeModule,
    QuillModule.forRoot(globalQuillConfig),
    NgxsModule.forRoot(states),
    NgxsRouterPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot({
      disabled: true
    }),
    TooltipModule.forRoot(),
    BrowserAnimationsModule,
    InfiniteScrollModule,
    NgxsReduxDevtoolsPluginModule.forRoot(),
    ColidIconsModule.forRoot(),
    ColidSnackBarModule.forRoot(),
    BrowserSupportModule,
    NgSelectModule,
    AuthenticationModule.forRoot(),
    NotificationModule.forRoot(),
    SharedModule,
    NgxImageZoomModule,
    CookieModule.withOptions(),
  ],
  providers: [
    DatePipe,
    LogService,
    LogPublishersService,
    DocumentService,
    MetadataService,
    SearchService,
    StatusApiService,
    UserInfoApiService,
    WelcomeMessageApiService,
    ResourceApiService,
    { provide: HTTP_INTERCEPTORS, useClass: ColidDefaultInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    FavoritesService,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ],
  exports: [],
  bootstrap: [AppComponent, MsalRedirectComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {

}
