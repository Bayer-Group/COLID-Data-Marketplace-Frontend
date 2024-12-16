import {
  Component,
  Directive,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { FormItemChangedDTO } from '../models/form/form-item-changed-dto';
import { ColidAccount } from 'src/app/modules/authentication/models/colid-account.model';
import { EMPTY, Observable, of } from 'rxjs';
import { IconTypes } from 'src/app/modules/colid-icons/models/icon-types';
import { ColidEntrySubscriptionDto } from '../models/user/colid-entry-subscription-dto';
import { DetailsViewModel } from 'src/app/components/search-result/search-result.component';
import { DocumentMap, SearchHit } from '../models/search-result';
import { MetaDataProperty } from '../models/metadata/meta-data-property';
import { PidUriTemplateResultDTO } from '../models/pidUriTemplates/pid-uri-template-result-dto';
import { Resource } from '../models/resources/resource';
import { ValidationResultProperty } from '../models/validation/validation-result-property';
import { ResourceCreationType as EntityCreationType } from 'src/app/shared/models/resources/resource-creation-type';
import { Favorites } from '../models/favorites';
import { RangeFilter, RangeFilterSelection } from '../models/range-filter';
import { UserDto } from '../models/user/user-dto';
import { HistoryItemTableEntry } from 'src/app/modules/admin/link-history-view/link-history/link-history.component';
import { EntityBase } from '../models/entities/entity-base';
import { TaxonomyResultDTO } from '../models/taxonomy/taxonomy-result-dto';
import { ExcelExportPayload } from '../models/export/excel-export-payload';

/**
 * This is a collection of generic mocks for unit tests.
 *
 * Gathering them in one place reduces duplication and makes it easier to maintain unit tests,
 * especially when the mocks are used in multiple test files.
 */

////////////////
// Components //
////////////////

/**
 * Usage:
 * Declare the mock classes in the testing module:
 *
 * beforeEach(() => {
 *   TestBed.configureTestingModule({
 *     declarations: [
 *       FormItemInputDatetimeComponent,
 *       MockFormItemInputBaseComponent,
 *       MockLastIndexStringPipe
 *     ],
 *     ...
 *   }.compileComponents();
 *
 * Then in a test spec, spy on methods/properties and mock return values as needed.
 */

@Component({
  selector: 'app-admin',
  template: ''
})
export class MockAdminComponent {}

@Component({
  selector: 'action-button',
  template: ''
})
export class MockActionButtonComponent {
  @Input() type: 'mat-raised-button' | 'mat-icon-button' = 'mat-raised-button';
  @Input() fontSet: 'material-icons-outlined' | 'material-icons' =
    'material-icons-outlined';
  @Input() color: string = 'primary';
  @Input() disabled: boolean = false;
  @Input() icon: string;
  @Input() loading: boolean = false;
}

@Component({
  selector: 'ensure-browser-support',
  template: ''
})
export class MockBrowserSupportComponent {}

@Component({
  selector: 'ds-icon',
  template: ''
})
export class MockColidIconsComponent {
  @Input() icon: string;
  @Input() delay: number;
  @Input() tooltip: string;
  @Input() tooltipDisabled = true;
  @Input() iconType: IconTypes = IconTypes.Default;
}

@Component({
  selector: 'app-colid-spinner',
  template: ''
})
export class MockColidSpinnerComponent {
  @Input() diameter: Number = 100;
  @Input() strokeWidth: Number = 5;
}

@Component({
  selector: 'colid-tree-view',
  template: ''
})
export class MockColidTreeViewComponent {
  @Input() singleSelection: boolean = false;
  @Input() TREE_DATA: TaxonomyResultDTO[] = [];
  @Input() taxonomysToExpand: TaxonomyResultDTO[] = [];
  @Input() highlightSelectedNode: boolean = false;
  @Input() set selectedNodes(values: string[]) {}
  @Input() set highlightedTaxonomyDetail(value: TaxonomyResultDTO | null) {}
}

@Component({
  selector: 'app-clustering-wrapper',
  template: ''
})
export class MockClusteringWrapperComponent {}

@Component({
  selector: 'colid-favorites',
  template: ''
})
export class MockFavoritesComponent {
  @Input() set user(id: string) {}
  @Input() set sidebarOpen(open: boolean) {}
}

@Component({
  selector: 'app-favorite-list',
  template: ''
})
export class MockFavoriteListComponent {
  @Input() favorites: Favorites[];
  @Input() userId: string;
  @Input() selectedListEntryId: string;
}

@Component({
  selector: 'app-feedback',
  template: ''
})
export class MockFeedbackComponent {
  @Input() payload: object;
  @Input() feature: string;
}

@Component({
  selector: 'app-filter-box-item-daterange',
  template: ''
})
export class MockFilterBoxItemDaterangeComponent {
  @Input() rangeFilter: RangeFilter;
  @Input() set selection(rangeFilter: RangeFilterSelection) {}
}

@Component({
  selector: 'app-form',
  template: ''
})
export class MockFormComponent {
  @Input() adminPrivilege: boolean;
  @Input() readOnly: boolean;
  @Input() nestedForm: boolean;
  @Input() pidUriTemplatesFetched: Observable<boolean>;
  @Input() pidUriTemplateNames: Observable<Array<PidUriTemplateResultDTO>>;
  @Input() placeholder: any;
  @Input() isNew: boolean;
  @Input() isTypeChanging: boolean;
  @Input() formReadOnly: boolean;
  @Input() hasPublishedVersion: boolean;
  @Input() creationType: EntityCreationType;
  @Input() mainDistribution: string;
  @Input() indexerNested: number;
  @Input()
  set entity(entity: Resource) {}
  @Input() linkingMetadata: MetaDataProperty[];
  @Input()
  set metaData(metaData: MetaDataProperty[]) {}
  @Input()
  set errors(errors: ValidationResultProperty[]) {}
}

@Component({
  template: ''
})
export class MockFormItemInputBaseComponent {
  @Input() name: string;
  @Input() readOnly: boolean;
  @Input() adminPrivilege: boolean;
  @Output() valueChanged: EventEmitter<FormItemChangedDTO> =
    new EventEmitter<FormItemChangedDTO>();
}

@Component({
  selector: 'app-form-item-errors',
  template: ''
})
export class MockFormItemErrorsComponent {
  @Input() name: string;
  @Input() errors: any;
}

@Component({
  selector: 'app-pid-uri-template-table',
  template: ''
})
export class MockPidUriTemplateTableComponent {}

@Component({
  selector: 'app-resource-item-tile',
  template: ''
})
export class MockResourceItemTileComponent {
  @Input() pidUri: string;
  @Input() resourceType: string;
  @Input() label: string;
  @Input() resourceDefinition: string;
  @Input() lifeCycleStatus: string;
  @Input() resourceLinkedLifecycleStatus: string | null;
}

@Component({
  selector: 'app-saved-searches-tile',
  template: ''
})
export class MockSavedSearchesTileComponent {}

@Component({
  selector: 'app-search-bar',
  template: ''
})
export class MockSearchBarComponent {
  @Input() initialSearchText: string;
  @Input() autocompleteResult: Observable<string[]>;
  @Input() focusSearchbar: boolean = false;
}

@Component({
  selector: 'app-search-result',
  template: ''
})
export class MockSearchResultComponent {
  @Input() set result(value: SearchHit) {}
  @Input() set source(value: DocumentMap) {}
  @Input() metadata: any;
  @Input() collapsible: boolean = true;
  @Input() expandByDefault: boolean = false;
  @Input() index: number = 0;
  @Input() showResourceDetailsButton: boolean = false;
  @Input() resourceLinkedLifecycleStatus: string | null;
  @Output() schemeUiChange: EventEmitter<object> = new EventEmitter<object>();
}

@Component({
  selector: 'app-search-bar-autocomplete',
  template: ''
})
export class MockSearchBarAutocompleteComponent {
  @Input() initialSearchText;
  @Input() focusSearchbar: boolean = true;
}

@Component({
  selector: 'app-sidebar',
  template: ''
})
export class MockSidebarComponent {
  @Input() initialFilterPanel: boolean = false;
}

@Component({
  selector: 'app-subscriptions-tile',
  template: './subscriptions-tile.component.html'
})
export class MockSubscriptionsTileComponent {}

@Component({
  selector: 'app-user-preferences-sidebar',
  template: ''
})
export class MockUserPreferencesSidebarComponent {}

@Component({
  selector: 'app-latest-resource-changes-tile',
  template: ''
})
export class MockLatestResourceChangesTileComponent {}

@Component({
  selector: 'colid-link-history',
  template: ''
})
export class MockLinkHistoryComponent {
  @Input() set isLoading(value: boolean) {}
  @Input() set historyItemsSource(value: HistoryItemTableEntry[]) {}
}

@Component({
  selector: 'app-navbar',
  template: ''
})
export class MockNavbarComponent {}

@Component({
  selector: 'colid-notification',
  template: ''
})
export class MockNotificationComponent {
  @Input() set user(id: string) {}
  @Input() set sidebarOpen(open: boolean) {}
}

@Component({
  selector: 'app-notifications-tile',
  template: ''
})
export class MockNotificationsTileComponent {
  @Input() user: UserDto;
}

@Component({
  selector: 'app-resource-operations-buttons',
  template: ''
})
export class MockResourceOperationsButtonsComponent {
  @Input() pidUri: string;
  @Input() details: DetailsViewModel[];
  @Input() source: DocumentMap;
  @Input() entryLifeCycleStatus: string;
  @Input() resourceLinkedLifecycleStatus: string | null;
  @Input() colidEntrySubscriptions: ColidEntrySubscriptionDto[];
  @Input() searchText: string;
  @Input() searchTimestamp: string;
  @Input() entityType: string;
  @Input() showFavoritesButton: boolean = false;
  @Input() showSubscribeButton: boolean = false;
}

@Component({
  selector: 'app-resource-quality-indicators',
  template: ''
})
export class MockResourceQualityIndicatorsComponent {
  @Input() brokenDistributionEndpoints: string[] | undefined;
  @Input() brokenContacts: string[] | undefined;
  @Input() nextReviewIsDue: boolean | undefined;
}

@Component({
  selector: 'app-resource-status-indicators',
  template: ''
})
export class MockResourceStatusIndicatorsComponent {
  @Input() entryLifeCycleStatus: string;
  @Input() resourceLinkedLifecycleStatus: string;
}

@Component({
  selector: 'app-welcome-content',
  template: ''
})
export class MockWelcomeContentComponent {}

//////////////
// Services //
//////////////

/**
 * Usage:
 * Add service mocks to providers:
 *
 * beforeEach(() => {
 *   TestBed.configureTestingModule({
 *     providers: [
 *       { provide: AuthService, useClass: MockAuthService }
 *     ],
 *     ...
 *   }.compileComponents();
 *
 * Then in a test spec, spy on methods/properties and mock return values as needed.
 */

export class MockAuthService {
  get isLoggedIn$(): Observable<boolean | null> {
    return of(true);
  }

  get currentIdentity$(): Observable<ColidAccount> {
    return of(
      new ColidAccount('Test User', 'test@user.email', '123', ['test'])
    );
  }

  get hasCreatePrivilege$() {
    return EMPTY;
  }

  get hasAdminPrivilege$() {
    return EMPTY;
  }

  get currentEmail$() {
    return EMPTY;
  }

  get currentUserId$() {
    return EMPTY;
  }

  subscribeCheckAccount(): void {}
  cleanup() {}
}

export class MockAgentStatisticsApiService {
  getOverallStatistics() {
    return EMPTY;
  }

  getDetailedStatistics() {
    return EMPTY;
  }
}

export class MockAttachmentApiService {}

export class MockColidIconsService {}

export class MockColidMatSnackBarService {
  success(): void {}
}

export class MockConsumerGroupApiService {
  createEntity() {
    return EMPTY;
  }

  editEntity() {
    return EMPTY;
  }
}

export class MockDocumentService {
  getDocuments() {
    return EMPTY;
  }
}

export class MockEntityFormService {
  createEntity() {
    return {} as EntityBase;
  }
}

export class MockEnsureBrowserSupportService {
  isSupported(): boolean {
    return true;
  }
}

export class MockExportService {
  getExportResultsPayload() {
    return {} as ExcelExportPayload;
  }

  startExcelExport() {
    return EMPTY;
  }

  getExportSelectedResultsPayload() {
    return {} as ExcelExportPayload;
  }
}

export class MockFavoritesService {
  createFavoritesList() {
    return EMPTY;
  }
}

export class MockFormService {}

export class MockGraphManagementApiService {
  uploadGraph() {}

  getGraphUploadStatus() {}
}

export class MockKeywordManagementApiService {
  modifyKeywordGraph() {
    return EMPTY;
  }
}

export class MockLogService {
  info(): void {}
  debug(): void {}
}

export class MockMetadataService {
  getLinkTypes() {
    return EMPTY;
  }
}

export class MockReindexApiService {
  getIndexingStatus() {
    return EMPTY;
  }
}

export class MockResourceApiService {
  searchLinkHistory() {
    return EMPTY;
  }
}

export class MockSearchService {
  fetchLastChangedResourcesOfAnUser() {
    return EMPTY;
  }
}

export class MockSimilarityService {}

export class MockTitleService {
  setTitle(): void {}
}

export class MockUserInfoApiService {
  getUsers() {
    return EMPTY;
  }

  getUserDepartmentsFlowView() {
    return EMPTY;
  }
}

////////////////
// Directives //
////////////////

@Directive({
  selector: '[debounce]'
})
export class MockDebounceDirective {
  @Input('debounce')
  public debounceTime = 500;
}

@Directive({
  selector: '[editorAccessControl]',
  standalone: true
})
export class MockEditorAccessControlDirective {
  @Input() resourceDetails: DetailsViewModel[];
}

///////////////////
// Other classes //
///////////////////

/**
 * Usage:
 * Add mocks to providers via useClass:
 *
 * beforeEach(() => {
 *   TestBed.configureTestingModule({
 *     providers: [
 *       { provide: MatDialogRef, useClass: MockMatDialogRef }
 *     ],
 *     ...
 *   }.compileComponents();
 *
 * Then in a test spec, spy on methods/properties and mock return values as needed.
 */

export class MockMatDialogRef {
  open(): void {}

  close(): void {}
}

/////////////////////
// Other constants //
/////////////////////

/**
 * Usage:
 * Add mocks to providers via useValue:
 *
 * beforeEach(() => {
 *   TestBed.configureTestingModule({
 *     providers: [
 *       { provide: ActivatedRoute, useValue: mockActivatedRoute }
 *     ],
 *     ...
 *   }.compileComponents();
 *
 * Then in a test spec, spy on methods/properties and mock return values as needed.
 */

export const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: () => 'mockValue'
    }
  },
  queryParams: of({ key: 'value' })
};
