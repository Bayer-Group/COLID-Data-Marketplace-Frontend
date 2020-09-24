import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgSelectModule } from '@ng-select/ng-select';
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
import { CheckForUpdateService } from './shared/services/update/check-for-update.service';
import { PromptUpdateService } from './shared/services/update/prompt-update.service';

// States
import { FilterState } from './states/filter.state';
import { SearchState } from './states/search.state';
import { StatusState } from './states/status.state';
import { MetadataState } from './states/metadata.state';
import { SidebarState } from './states/sidebar.state';
import { UserInfoState } from './states/user-info.state';
import { WelcomeMessageState } from './states/welcome-message.state'

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
import { ServiceWorkerModule } from '@angular/service-worker';
import { ColidIconsModule } from './modules/colid-icons/colid-icons.module';
import { BrowserSupportModule } from './modules/browser-support/browser-support.module';
import { ResourceApiService } from './core/http/resource.api.service';
import { ColidEntrySubscriptionsState } from './states/colid-entry-subscription.state';
import { SharedModule } from './shared/shared-module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { NotificationModule } from './modules/notification/notification.module';

const states = [
  FilterState,
  SearchState,
  StatusState,
  MetadataState,
  SidebarState,
  UserInfoState,
  WelcomeMessageState,
  ColidEntrySubscriptionsState
];

@NgModule({
  declarations: [
    AppComponent,
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
    DistributionEndpointComponent,
    RangeBoxComponent,
    UnauthorizedComponent,
    SearchResultLinkTypeComponent,
    SupportFeedbackBarComponent,
    LinkedResourceDisplayDialog,
    HighlightPipe,
    FilterBoxItemTaxonomyComponent,
  ],
  imports: [
    TypeaheadModule.forRoot(),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AppMaterialModule,
    HttpClientModule,
    FontAwesomeModule,
    NgxsModule.forRoot(states),
    NgxsRouterPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    TooltipModule.forRoot(),
    BrowserAnimationsModule,
    InfiniteScrollModule,
    ColidIconsModule.forRoot(),
    ColidSnackBarModule.forRoot(),
    BrowserSupportModule,
    NgSelectModule,
    AuthenticationModule.forRoot(),
    NotificationModule.forRoot(),
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
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
    CheckForUpdateService,
    PromptUpdateService,
    ResourceApiService,
    ResourceApiService,
    { provide: HTTP_INTERCEPTORS, useClass: ColidDefaultInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
  entryComponents: [
    LinkedResourceDisplayDialog
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
