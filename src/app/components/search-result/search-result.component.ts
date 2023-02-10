import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { SearchHit, DocumentMap, DocumentMapDirection, StringArrayMap } from '../../shared/models/search-result';
import { Constants } from 'src/app/shared/constants';
import { environment } from 'src/environments/environment';
import { getValueForKey, getUriForKey, getPidUriForHref } from 'src/app/shared/operators/document-operators';
import { LogService } from 'src/app/core/logging/log.service';
import { FetchLinkedTableandColumnResults, SearchState } from 'src/app/states/search.state';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LinkedResourceDisplayDialog } from 'src/app/components/linked-resource-dialog/linked-resource-display-dialog.component';
import { ColidEntrySubscriptionDto } from 'src/app/shared/models/user/colid-entry-subscription-dto';
import { AddColidEntrySubscription, RemoveColidEntryFavorite, RemoveColidEntrySubscription, UserInfoState } from 'src/app/states/user-info.state';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service'
import { ColidEntrySubscriberCountState, FetchColidEntrySubscriptionNumbers } from '../../states/colid-entry-subcriber-count.state';
import { SimilarityModalComponent } from 'src/app/components/search-result/similarity-modal/similarity-modal.component';
import { ResourcePoliciesComponent } from './resource-policies/resource-policies.component';
import { ResourcePoliciesState } from 'src/app/states/resource-policies.state';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Schema_Support, SchemeUi } from 'src/app/shared/models/schemeUI';
import { Favorites } from 'src/app/shared/models/favorites';
import { FavoritesState, FetchFavorites } from '../favorites/favorites.state';
import { AddFavoriteDialogComponent } from '../favorites/components/add-favorite-dialog/add-favorite-dialog.component';
import { ViewDescriptionDialogComponent } from '../search-result/view-description-dialog/view-description-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit, OnDestroy, OnChanges {
  private _result: SearchHit;
  private _source: DocumentMap;

  @Select(SearchState.getSearchText) searchTextObservable$: Observable<string>;
  @Select(SearchState.getSearchTimestamp) searchTimestampObservable$: Observable<Date>;
  @Select(UserInfoState.getColidEntrySubscriptions) colidEntrySubscriptions$: Observable<ColidEntrySubscriptionDto[]>;
  @Select(ColidEntrySubscriberCountState.getSubscriptionNumbers) colidEntrySubscriptionNumbers$: Observable<ColidEntrySubscriptionDto[]>;
  @Select(FavoritesState.getFavorites) favorites$: Observable<Favorites>;
  @Select(ResourcePoliciesState.getLoadingState) PoliciesLoadingState$: Observable<boolean>;
  @Select(SearchState.getLinkedTableAndColumnResource) SchemeUI$: Observable<SchemeUi>;
  @Select(SearchState.getLoading) loading$: Observable<boolean>;
  @Select(FavoritesState.getFavoriteUriList) favUris$: Observable<string[]>;
  @ViewChild('tabGroup') tabGroup;
  @Input() set result(value: SearchHit) {
    if (this._result) {
      this.onResultChange(value);
    }

    this._result = value;
    this._source = value.source;
  };

  @Input() set source(value: DocumentMap) {
    if (this._source) {
      this.onSourceChange(value);
    }

    this._source = value;
    this.expandView = true;
  };
  attachment =  Constants.Metadata.HasAttachment 
  version = Constants.Metadata.HasVersion

  @Input() metadata: any;
  @Input() collapsible: boolean = true;
  @Input() expandByDefault: boolean = false;
  @Input() index: number = 0;
  @Output() schemeUiChange: EventEmitter<object> = new EventEmitter<object>();


  get pidUri() {
    var rawPidUri;
    if (this._result != null) {
      rawPidUri = this._result.id;
    } else {
      rawPidUri = this._source[Constants.Metadata.HasPidUri].outbound[0].uri;
    }

    return decodeURIComponent(rawPidUri);
  }

  get entityType() {
    const rawEntityType = this._source[Constants.Metadata.EntityType].outbound[0].uri;
    return decodeURIComponent(rawEntityType);
  }

  get expanded() {
    return this.expandView || this.expandByDefault;
  }

  expandView: boolean = false;

  developmentMode: boolean;
  constants = Constants;

  score: number;
  label: string[] = new Array<string>();

  colidEntrySubscriptionsSubscription: Subscription;
  colidEntrySubscriptions: ColidEntrySubscriptionDto[] = [];
  favoritesAdded: Favorites;
  favorites: Favorites;
  isSubscribed: boolean;
  isFavorited: boolean = false;

  resourceSubNumbers: ColidEntrySubscriptionDto[] = [];
  ResourceNumSubscription: Subscription;

  versions: DocumentMapDirection;
  baseUriPointsAt: string;
  subjectPidUriMap = new Map<string, string>();

  definitionHighlight: string[] = new Array<string>();
  resourceType: string[] = new Array<string>();
  details: DetailsViewModel[];
  schemeUiDetail: SchemeUi;
  showSchema: boolean = false;
  distributionData: any[] = [];
  showDistribution: boolean = false;
  distributionKey = Constants.DistributionEndpoint.DistributionKey;
  linkedResourceData: any = [];
  showLinkedResources: boolean = false;
  linkedKey = Constants.Shacl.Groups.LinkTypes;
  activeTab: any[] = []
  selectedPidUri: string = "";
  isOpenSchemeUiTab: string = ""
  nextReviewDate: string = ""
  expandedNested: any = {};
  selectedIndex = 0;
  searchText: string;
  searchTimestamp: Date;
  InputType = InputType;
  currentUTCDate : number;

  constructor(
    private store: Store,
    private logger: LogService,
    private snackBar: ColidMatSnackBarService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer) { }



  ngOnChanges(changes: SimpleChanges): void {
    if(this.details){
      if (this.details.find(x => x.key == this.linkedKey)) {
        this.showLinkedResources = true;
        this.linkedResourceData = this.details.find(x => x.key == this.linkedKey);
        this.details = this.details.filter((x) => {
          return x.key != this.linkedKey;
        });
      }
    }
    
  }

  ngOnInit() {
    this.colidEntrySubscriptionsSubscription = this.colidEntrySubscriptions$.subscribe(colidEntrySubscriptions => {
      if (colidEntrySubscriptions != null) {
        this.isSubscribed = colidEntrySubscriptions.some(ces => ces.colidPidUri === this.pidUri)
        this.colidEntrySubscriptions = colidEntrySubscriptions;
      }
      this.ResourceNumSubscription = this.colidEntrySubscriptionNumbers$.subscribe(x => {
        this.resourceSubNumbers = x;
      });
    });

    this.favUris$.subscribe(r => {
      this.isFavorited = r.indexOf(this.pidUri) > -1;
    })

    this.developmentMode = !environment.production;
    if (this._result != null) {
      this.onResultChange(this._result);
    }
    else {
      if (this._source != null) {
        this.onSourceChange(this._source);
      }
    }

    this.searchTextObservable$.subscribe(searchText => {
      this.searchText = searchText;
    });

    this.searchTimestampObservable$.subscribe(searchTimestamp => {
      this.searchTimestamp = searchTimestamp;
    });

    if (this.details.find(x => x.key == this.distributionKey)) {
      this.showDistribution = true;
    }

    if (this.details.find(x => x.key == this.linkedKey)) {
      this.showLinkedResources = true;
      this.linkedResourceData = this.details.find(x => x.key == this.linkedKey);
      this.details = this.details.filter((x) => {
        return x.key != this.linkedKey;
      });
    }
    const today = new Date();
    this.currentUTCDate = Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    
    if (this.details.find(x => x.key == Constants.Metadata.HasNextReviewDueDate)) {
      this.nextReviewDate = this.details.find(x => x.key == Constants.Metadata.HasNextReviewDueDate).value[0]
    }

  }

  NextReviewDateIsDue(){
    const date = new Date(this.nextReviewDate)
    let resourceDueDateUTC = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    return resourceDueDateUTC < this.currentUTCDate;
  }

  expandPanel() {
    this.expandView = true;
  }

  ngOnDestroy() {
    this.colidEntrySubscriptionsSubscription.unsubscribe();
    this.ResourceNumSubscription.unsubscribe();
  }

  subscribeToResource(event) {
    this.preventOpeningResultDetails(event);

    let colidEntrySubscriptionDto = new ColidEntrySubscriptionDto(this.pidUri);
    this.store.dispatch(new AddColidEntrySubscription(colidEntrySubscriptionDto)).subscribe(() => {
      this.snackBar.success('Resource subscribed', 'The resource has been subscribed successfully.');
    });
  }

  findSimilarResources(event) {
    this.preventOpeningResultDetails(event);
    const pidUri = decodeURIComponent(this._result.id);

    const dialogRef = this.dialog.open(SimilarityModalComponent, {
      data: {
        pidUri: pidUri,
        label: this._result.source[Constants.Metadata.HasLabel]["outbound"][0].value,
        source: this._result.source
      },
      width: 'auto',
      height: 'auto'
    });
  }

  findPolicies(event) {
    this.preventOpeningResultDetails(event);
    const pidUri = decodeURIComponent(this._result.id);
    const dialogRef = this.dialog.open(ResourcePoliciesComponent, {
      data: {
        pidUri: pidUri
      }
    });

  }

  unsubscribeFromResource(event) {
    this.preventOpeningResultDetails(event);

    let colidEntrySubscriptionDto = new ColidEntrySubscriptionDto(this.pidUri);
    this.store.dispatch(new RemoveColidEntrySubscription(colidEntrySubscriptionDto)).subscribe(() => {
      this.snackBar.success('Resource unsubscribed', 'The resource has been unsubscribed successfully.');
    });
  }

  //Favorites

  openFavoritesDialog(event) {
    this.preventOpeningResultDetails(event);
    const pidUri = decodeURIComponent(this._result.id);
    const dialogRef = this.dialog.open(AddFavoriteDialogComponent, {
      height: '400px',
      width: '500px',
      data: {
        pidUri: pidUri,
        multiSelect : false
      }
    });
    }


    openDescriptionDialog(comment, label, description) {
      if(comment || description){
        const dialogRef = this.dialog.open(ViewDescriptionDialogComponent, {
          width: '400px',
          height: 'auto',
          data: {
            comment: comment,
            label: label,
            description: description
          }
        });
      }
    }
  
   removeFromFavorites(event) {
      this.preventOpeningResultDetails(event);

      //TODO: Implement
    }


  getNumSubscribers(): number {
    var sr = 0;
    if (this.resourceSubNumbers.find(x => x.colidPidUri === this.pidUri)) {
      sr = this.resourceSubNumbers.find(x => x.colidPidUri === this.pidUri).subscriptions;
    }

    return sr;
  }

  openInKnowledgeGraphExplorer(event) {
    this.preventOpeningResultDetails(event);

    this.logger.info("DMP_RESULT_PAGE_RESOURCE_KGE_CLICKED",
      {
        'searchText': this.searchText,
        'searchTimestamp': this.searchTimestamp,
        'resourcePIDUri': getPidUriForHref(this.details)[0],
      });
    const internalResourceId = this._source.internalResourceId.outbound[0].uri;
    // we need to replace the # with the encoded character %23,
    // otherwise the value can not be passed as query parameter
    const encodedId = internalResourceId.replace(new RegExp('(\#)', "g"), "%23");
    const url = `${environment.kgeUrl}?store=colid&profile=colid&baseNode=${encodedId}`;
    window.open(url, '_blank');
  }

  openInColidEditor(event) {
    this.preventOpeningResultDetails(event);

    this.logger.info("PID_RESULT_PAGE_RESOURCE_EDIT_CLICKED",
      {
        'searchText': this.searchText,
        'searchTimestamp': this.searchTimestamp,
        'resourcePIDUri': getPidUriForHref(this.details)[0],
      });

    const internalResourceId = getPidUriForHref(this.details)[0];
    // we need to replace the # with the encoded character %23,
    // otherwise the value can not be passed as query parameter
    const encodedId = internalResourceId.replace(new RegExp('(\#)', "g"), "%23");

    const url = `${environment.pidUrl}resource?pidUri=${encodedId}`;
    window.open(url, '_blank');
  }

  openInResourceRelationshipManager(event) {
    this.preventOpeningResultDetails(event);

    this.logger.info("DMP_RESULT_PAGE_RESOURCE_RRM_CLICKED",
      {
        'searchText': this.searchText,
        'searchTimestamp': this.searchTimestamp,
        'resourcePIDUri': getPidUriForHref(this.details)[0],
      });
    const internalResourceId = getPidUriForHref(this.details)[0];
    // we need to replace the # with the encoded character %23,
    // otherwise the value can not be passed as query parameter
    const encodedId = internalResourceId.replace(new RegExp('(\#)', "g"), "%23");
    const url = `${environment.rrmUrl}?baseNode=${encodedId}`;
    window.open(url, '_blank');
  }

  preventOpeningResultDetails(event) {
    event.stopPropagation();
  }

  toggleShowingNested(key: string) {
    if (this.expandedNested[key]) {
      this.expandedNested[key] = false;
    } else {
      this.expandedNested[key] = true;
    }
  }

  onResultChange(value: SearchHit) {
    const sourceCopy: DocumentMap = { ...value.source };
    this.score = value.score;
    const orderable = this.parseItemsToDetailsList(sourceCopy, null, value.highlight);

    orderable.sort((left, right) => {
      const groupCompare = left.groupOrder - right.groupOrder;
      if (groupCompare !== 0) {
        return groupCompare;
      }
      const orderCompare = left.order - right.order;
      return orderCompare;
    });

    //We are remove table and colum from linked resouece,we will show in schema Ui
    this.removeTableandColumn(orderable);
    this.details = orderable;
  }

  onSourceChange(value: DocumentMap) {
    const sourceCopy: DocumentMap = { ...value };
    const orderable = this.parseItemsToDetailsList(sourceCopy, null, null);

    orderable.sort((left, right) => {
      const groupCompare = left.groupOrder - right.groupOrder;
      if (groupCompare !== 0) {
        return groupCompare;
      }
      const orderCompare = left.order - right.order;
      return orderCompare;
    });

    //We are remove table and colum from linked resouece,we will show in schema Ui
    this.removeTableandColumn(orderable);
    this.details = orderable;
  }

  onResultClicked(expanded): void {
    this.expandView = !expanded;
    this.logger.info("DMP_RESULT_PAGE_RESOURCE_CLICKED",
      {
        'searchText': this.searchText,
        'searchTimestamp': this.searchTimestamp,
        'resourcePIDUri': getPidUriForHref(this.details)[0],
        'resourceLastChangeDate': getValueForKey(this.details, Constants.Metadata.LastChangeDateTime)[0],
        'clickedLinkType': this._source[Constants.Metadata.EntityType].outbound[0].uri,
        'clickedLinkCategory': Constants.Metadata.PIDClass
      });
  }

  removeTableandColumn(orderable) {
    /***********************We check resouece type*********************************/
    var currentResourceType = orderable.find(x => x.key == Constants.Metadata.EntityType).valueEdge[0]
    /***********************We check Linked resource from current resource type*********************************/
    var link = orderable.find(x => x.key == Constants.Resource.Groups.LinkTypes)
    if (link) {

      var nested = [...link.nested]; //
      var nestedInbound = [...link.nestedInbound];

      var currentTaxonmony = this.metadata[Constants.Metadata.EntityType].properties.taxonomy;
      /***********************We get all dataset type from metadata*********************************/
      var datasets = currentTaxonmony?.filter(x => x.properties[Schema_Support.Subset][0] == Schema_Support.Dataset)
      /***********************We check current resource is dataset or not*********************************/
      var existDataset = datasets?.find(x => x.id == currentResourceType)

      /***********************We check if resource type is table or dataset*********************************/
      if (existDataset || Schema_Support.Table == currentResourceType) {
        nested.forEach((x) => {
          var nestedresourceType = x.value.find(x => x.key == Constants.Metadata.EntityType).valueEdge[0]
          if (Schema_Support.Table == nestedresourceType || Schema_Support.Column == nestedresourceType) {
            this.showSchema = true; //Show Schema Tab
            var index = link.nested.indexOf(x);
            //remove from linked list if linked resource type is table or column
            link.nested.splice(index, 1);
          }

        });
        //Linked resource is delete from linked list if resource is table or column from nestedInbund
        nestedInbound.forEach((x) => {
          var nestedInboundresourceType = x.value.find(x => x.key == Constants.Metadata.EntityType).valueEdge[0]
          if (Schema_Support.Table == nestedInboundresourceType || Schema_Support.Column == nestedInboundresourceType) {
            this.showSchema = true; //Show Schema Tab
            var index = link.nestedInbound.indexOf(x);
            //remove from linked list if linked resource type is table or column
            link.nestedInbound.splice(index, 1);
          }
        });
      }
      // resource type is column
      else if (Schema_Support.Column == currentResourceType) {
        nested.forEach((x) => {
          var nestedresourceType = x.value.find(x => x.key == Constants.Metadata.EntityType).valueEdge[0]
          if (Schema_Support.Column == nestedresourceType) {
            this.showSchema = true; //Show Schema Tab
            var index = link.nested.indexOf(x);
            //remove from linked list if linked resource type is column
            link.nested.splice(index, 1);
          }
        });
        //Linked resource is delete from linked list if resource is  column nestedInbound
        nestedInbound.forEach((x) => {
          var nestedInboundresourceType = x.value.find(x => x.key == Constants.Metadata.EntityType).valueEdge[0]
          if (Schema_Support.Column == nestedInboundresourceType) {
            this.showSchema = true; //Show Schema Tab
            var index = link.nestedInbound.indexOf(x);
            //remove from linked list if linked resource type is column
            link.nestedInbound.splice(index, 1);
          }
        });
      }
      else {
        this.showSchema = false; //hide Schema Tab
      }
      // resource is not availabe in linked resource,we remove linked resource from list
      if (link.nested.length == 0 && link.nestedInbound.length == 0) {
        var linkedindex = orderable.indexOf(link);
        orderable.splice(linkedindex, 1)
      }
    }
  }

  onLinkClicked(detail: DetailsViewModel, event: Event): void {
    event.preventDefault();
    this.logger.info("DMP_RESULT_PAGE_RESOURCE_LINK_CLICKED", this.generateLogEntry(detail, detail.valueForHref[0]));
    window.open(detail.valueForHref[0], "_blank");
  }

  onVersionLinkClicked(detail: DetailsViewModel, version: any, event: Event): void {
    event.preventDefault();
    this.logger.info("DMP_RESULT_PAGE_RESOURCE_VERSION_LINK_CLICKED", this.generateLogEntry(detail, version.value[Constants.Metadata.HasPidUri].value));
    this.dialog.open(LinkedResourceDisplayDialog, {
      data: { id: version.value[Constants.Metadata.HasPidUri].value, confirmReview: false }
    });
  }

  generateLogEntry(detail: DetailsViewModel, clickedLink: string) {
    return {
      'searchText': this.searchText,
      'searchTimestamp': this.searchTimestamp,
      'resourcePIDUri': getPidUriForHref(this.details)[0],
      'resourceLastChangeDate': getValueForKey(this.details, Constants.Metadata.LastChangeDateTime)[0],
      'clickedLink': clickedLink,
      'clickedLinkEdge': detail.key,
      'clickedLinkType': this._source[Constants.Metadata.EntityType].outbound[0].uri,
      'clickedLinkCategory': Constants.Metadata.PIDClass
    }
  }

  GetMetadataOfDistributionEndpoint(distributionEndpoint) {
    var entityTypeUri = getUriForKey(distributionEndpoint, Constants.Metadata.EntityType);
    return this.metadata[Constants.DistributionEndpoint.DistributionKey].nestedMetadata.find(m => m.key == entityTypeUri[0]);
  }

  parseItemsToDetailsList(items: DocumentMap, parentKey: string, highlights: StringArrayMap): DetailsViewModel[] {
    const orderable: DetailsViewModel[] = [];

    for (const key of Object.keys(items)) {
      const item: DocumentMapDirection = items[key];
      const orderableItem = this.parseItemToDetailsViewModel(key, item, parentKey, items[Constants.Metadata.EntityType].outbound[0].uri, highlights);
      if (orderableItem !== null) {
        orderable.push(orderableItem);
      }
    }
    return orderable;
  }

  parseItemToDetailsViewModel(key: string, item: DocumentMapDirection, propertyKey: string, propertyType: string, highlight: StringArrayMap): DetailsViewModel {
    if (!key || !item) {
      return null;
    } else if (key === Constants.Metadata.HasVersions) {
      this.versions = item;
      return null;
    } else if (key === Constants.Metadata.BaseURIPointsAt) {
      this.baseUriPointsAt = item.outbound[0].value || item.outbound[0].uri;
    }

    const nestedField: boolean = item.outbound.some(t => typeof t.value !== "string" && t.value != null) || item.inbound.some(t => typeof t.value !== "string" && t.value != null)

    const highlightForKey = highlight ? (highlight[key + '.outbound.value.ngrams'] || highlight[key + '.outbound.value.text'] || highlight[key + '.outbound.value.Ngramtaxonomy'] || highlight[key + '.outbound.value.taxonomy']) : null;

    let value = new Array<string>();
    let valueEdge = new Array<string>();

    item.outbound.forEach(outboundValue => {
      const highlightValue = highlightForKey ? getHighlightValueFromList(highlightForKey, outboundValue.value) : null;
      if (key === Constants.Metadata.HasLabel) {
        value.push(outboundValue.value);
        valueEdge.push(outboundValue.uri);
      }
      else {
        value.push(highlightValue || outboundValue.value || outboundValue.uri);
        valueEdge.push(outboundValue.uri);
      }
    })


    let nested: DetailsViewModelNested[] = [];
    let nestedInbound: DetailsViewModelNested[] = [];

    let groupOrder = 0;
    if (nestedField) {
      let nestedHighlighting = highlightingForNestedObject(highlight, key, "outbound");

      nested = item.outbound.map(n => {
        var parsedItem = this.parseItemsToDetailsList(n.value, n.edge, nestedHighlighting);

        if (n.value[Constants.Metadata.HasPidUri] != null) {
          this.subjectPidUriMap.set(n.uri, n.value[Constants.Metadata.HasPidUri].outbound[0].value);
        }

        return { edge: n.edge, id: n.uri, value: parsedItem };
      });

      nestedHighlighting = highlightingForNestedObject(highlight, key, "inbound")
      nestedInbound = item.inbound.map(n => {
        var parsedItem = this.parseItemsToDetailsList(n.value, n.edge, nestedHighlighting);

        if (n.value[Constants.Metadata.HasPidUri] != null) {
          this.subjectPidUriMap.set(n.uri, n.value[Constants.Metadata.HasPidUri].outbound[0].value);
        }

        return { edge: n.edge, id: n.uri, value: parsedItem };
      });
    }

    let meta = null;

    // If the property key is set, we are looking at a nested property.
    if (propertyKey && this.metadata[propertyKey].properties[Constants.Shacl.Group].key !== Constants.Shacl.Groups.LinkTypes) {
      let nestedProperties = this.metadata[propertyKey].nestedMetadata.filter(m => m.key === propertyType)[0];
      let property = nestedProperties.properties.filter(nestedProp => nestedProp.properties[Constants.Metadata.HasPidUri] === key);
      meta = property[0];
    } else if (key === Constants.Shacl.Groups.LinkTypes) {
      meta = this.metadata
    } else {
      meta = this.metadata[key];
    }

    // Variable only used in case of PID URI.
    // PID URI is needed with highlighting for displaying and always without highlighting for links in html.
    let valueForHref: string[] = new Array<string>();

    if (meta) {
      const metaProps = key === Constants.Shacl.Groups.LinkTypes ? this.metadata : meta.properties;
      // special fields -> show first value of array as label and highlight defintiion
      if (metaProps[Constants.Shacl.Group]) {
        groupOrder = metaProps[Constants.Shacl.Group].order;
        if (!nestedField && !propertyKey) {
          switch (groupOrder) {
            case 1: this.label = replaceSpecialCharectorFromText(value); return null;
            case 2: this.definitionHighlight = replaceSpecialCharectorFromText(value); return null;

            case 10: this.label = replaceSpecialCharectorFromText(value);; return null;
            case 20: this.definitionHighlight = replaceSpecialCharectorFromText(value); return null;
          }
        }
      }

      let inputType = metaProps[Constants.Metadata.Datatype] === Constants.Metadata.Type.DateTime ? InputType.Date : InputType.HTML;

      // Only set in main resource and not in nested, since propertyKey is only set for nested properties.
      if (this.isPermanentIdentifier(metaProps)) {
        valueForHref = item.outbound.map(t => t.value);
        inputType = InputType.Link;
      }

      // Only set in main resource and not in nested, since propertyKey is only set for nested properties.
      if (propertyKey === null && metaProps[Constants.Metadata.HasPidUri] === Constants.Metadata.EntityType) {
        this.resourceType = item.outbound.map(t => t.uri);
      }

      if (metaProps[Constants.Metadata.HasPidUri] === Constants.Metadata.HasVersion) {
        inputType = InputType.Version
      }

      return {
        key: key,
        order: metaProps[Constants.Shacl.Order],
        groupOrder: key === Constants.Shacl.Groups.LinkTypes ? 90 : groupOrder,
        label: key === Constants.Shacl.Groups.LinkTypes ? "Linked Resources" : metaProps[Constants.Shacl.Name],
        hasPID: metaProps[Constants.Metadata.HasPidUri],
        value: value,
        valueForHref: valueForHref,
        valueEdge: valueEdge,
        inputType: inputType,
        nested: nested,
        nestedInbound: nestedInbound,
        comment: metaProps[Constants.Shacl.Comment],
        description: metaProps[Constants.Shacl.Description]
      };
    }
    return null;
  }

  GetSchemeUI(event: MatTabChangeEvent, details) {
    //this.activeTab="";
    var pidUri = details.find(x => x.key == Constants.Metadata.HasPidUri).valueEdge[0];
    if (event.tab.textLabel == "Schema") {
      //this.activeTab.push(pidUri);
      var schemeStatus = { isAdd: true, activetabList: pidUri }
      this.selectedIndex = event.index
      this.schemeUiChange.emit(schemeStatus);
      //var pidUri = details.find(x => x.key == 'http://pid.${environment.baseUrl}/kos/19014/hasPID').valueEdge[0];
      this.store.dispatch(new FetchLinkedTableandColumnResults(pidUri)).subscribe(result => {
        this.schemeUiDetail = new SchemeUi();
        this.schemeUiDetail = result.search.linkedTableAndcolumnResource
      });
    } else if (event.tab.textLabel == "Distribution Endpoint") {
      this.distributionData = details.find(x => x.key == Constants.DistributionEndpoint.DistributionKey)
    } else {
      this.selectedIndex = event.index
      this.activeTab.push(pidUri)
      var schemeStatus = { isAdd: false, activetabList: pidUri }
      this.schemeUiChange.emit(schemeStatus);
    }
  }


  private isPermanentIdentifier(metaProps: any): boolean {
    return metaProps[Constants.Metadata.RDFS.Range] === Constants.Identifier.Type;
  }
}

// Function returns highlighting only for nested properties of parent object.
// @param highlight All highlights for each property
// @param parentKey Key of the parent object.
// @returns Object with highlighting of nested objects of parentKey.
function highlightingForNestedObject(highlight, parentKey, direction) {
  let nestedHighlighting = {};
  let nestedKeyStart = parentKey + "." + direction + ".value.";
  for (let key in highlight) {
    // Check if property is nested property of parent object
    if (key.startsWith(nestedKeyStart)) {
      // Save highlighting for nested property to new object with shortend key
      nestedHighlighting[key.replace(nestedKeyStart, "")] = highlight[key];
    }
  }
  return nestedHighlighting;
}

// Function returns the correct highlight value, if there are more then one available.
// E.g. having multiple distribution endpoints with multiple highlighted values of the correct field,
// this function returns the correct match by comparing the highlighted value without HTML tags with the value of the field.
// @param highlights All highlights of the same type.
// @param value The value to match the highlight with.
// @returns The correct value of possible highlighted values.
function getHighlightValueFromList(highlights: Array<string>, value: string): string {
  let findings = highlights.find(element => {
    return getPlainText(element) === getPlainText(value);
  });

  return findings ? findings : null;
}

function getPlainText(htmlText: string) {
  var temp = document.createElement("div");
  temp.innerHTML = htmlText;
  return temp.textContent || temp.innerText || "";
}

//this function remove special chrector from htmltext
function replaceSpecialCharectorFromText(textArray: string[]) {
  return textArray.map(x => replaceSpecialChars(x));
}

function replaceSpecialChars(str: string) {
  str = str.replace(/[ÀÁÂÃÅ]/g, "A");
  str = str.replace(/[ÈÉÊË]/g, "E");
  str = str.replace(/[ÌÍÎ]/g, "I");
  str = str.replace(/[ÒÓÔÕ]/g, "O");
  str = str.replace(/[ÙÚÛ]/g, "U");
  str = str.replace(/[åàáâãåå]/g, "a");
  str = str.replace(/[èéêë]/g, "e");
  str = str.replace(/[ìíî]/g, "i");
  str = str.replace(/[òóôõø]/g, "o");
  str = str.replace(/[ùúû]/g, "u");
  str = str.replace(/[Ç]/g, "C");
  str = str.replace(/[Ð]/g, "D");
  str = str.replace(/[Ñ]/g, "N");
  str = str.replace(/[Ý]/g, "Y");
  str = str.replace(/[ç]/g, "c");
  str = str.replace(/[ñ]/g, "n");
  str = str.replace(/[ý]/g, "y");

  return str;
}

export class DetailsViewModel {
  key: string;
  hasPID: string;
  order: number;
  groupOrder: number;
  label: string;
  value: string[];
  valueForHref: string[];
  valueEdge: string[];
  inputType: InputType;

  nested: DetailsViewModelNested[];
  nestedInbound: DetailsViewModelNested[];
  comment: string;
  description: string;
}

export class DetailsViewModelNested {
  edge: string;
  id: string;
  value: DetailsViewModel[]
}

export enum InputType {
  HTML,
  Date,
  Link,
  Version
}
