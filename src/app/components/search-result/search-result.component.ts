import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SearchHit, Document, DocumentMap, DocumentMapDirection, StringArrayMap } from '../../shared/models/search-result';
import { Constants } from 'src/app/shared/constants';
import { environment } from 'src/environments/environment';
import { getValueForKey, getPidUriForHref } from 'src/app/shared/operators/document-operators';
import { LogService } from 'src/app/core/logging/log.service';
import { SearchState } from 'src/app/states/search.state';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LinkedResourceDisplayDialog } from 'src/app/components/linked-resource-dialog/linked-resource-display-dialog.component';
import { ColidEntrySubscriptionDto } from 'src/app/shared/models/user/colid-entry-subscription-dto';
import { AddColidEntrySubscription, RemoveColidEntrySubscription, UserInfoState } from 'src/app/states/user-info.state';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';


@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit, OnDestroy {
  private _result: SearchHit;
  private _source: DocumentMap;

  @Select(SearchState.getSearchText) searchTextObservable$: Observable<string>;
  @Select(SearchState.getSearchTimestamp) searchTimestampObservable$: Observable<Date>;
  @Select(UserInfoState.getColidEntrySubscriptions) colidEntrySubscriptions$: Observable<ColidEntrySubscriptionDto[]>;

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
    this.toggled = true;
  };

  @Input() metadata: any;

  developmentMode: boolean;
  constants = Constants;

  score: number;
  label: string[] = new Array<string>();

  colidEntrySubscriptionsSubscription: Subscription;
  colidEntrySubscriptions: ColidEntrySubscriptionDto[];
  isSubscribed: boolean;

  versions: DocumentMapDirection;
  baseUriPointsAt: string;
  subjectPidUriMap = new Map<string, string>();

  definitionHighlight: string[] = new Array<string>();
  resourceType: string[] = new Array<string>();
  details: DetailsViewModel[];

  toggled: boolean = false;
  toggledNested: any = {};

  searchText: string;
  searchTimestamp: Date;

  InputType = InputType;
  constructor(
    private store: Store,
    private logger: LogService,
    private snackBar: ColidMatSnackBarService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.colidEntrySubscriptionsSubscription = this.colidEntrySubscriptions$.subscribe(colidEntrySubscriptions => {
      if (colidEntrySubscriptions != null) {
        const pidUri = decodeURIComponent(this._result.id);
        this.isSubscribed = colidEntrySubscriptions.some(ces => ces.colidPidUri === pidUri)
        this.colidEntrySubscriptions = colidEntrySubscriptions;
      }
    });

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
  }

  ngOnDestroy() {
    this.colidEntrySubscriptionsSubscription.unsubscribe();
  }

  subscribeToResource(event) {
    this.preventOpeningResultDetails(event);

    const pidUri = decodeURIComponent(this._result.id);
    let colidEntrySubscriptionDto = new ColidEntrySubscriptionDto(pidUri);
    this.store.dispatch(new AddColidEntrySubscription(colidEntrySubscriptionDto)).subscribe(() => {
      this.snackBar.success('Resource subscribed', 'The resource has been subscribed successfully.');
    });
  }

  unsubscribeFromResource(event) {
    this.preventOpeningResultDetails(event);

    const pidUri = decodeURIComponent(this._result.id);
    let colidEntrySubscriptionDto = new ColidEntrySubscriptionDto(pidUri);
    this.store.dispatch(new RemoveColidEntrySubscription(colidEntrySubscriptionDto)).subscribe(() => {
      this.snackBar.success('Resource unsubscribed', 'The resource has been unsubscribed successfully.');
    });
  }

  openInKnowledgeGraphExplorer(event) {
    this.preventOpeningResultDetails(event);

    this.logger.info("DMP_RESULT_PAGE_RESOURCE_KGE_CLICKED",
      {
        'searchText': this.searchText,
        'searchTimestamp': this.searchTimestamp,
        'resourcePIDUri': getPidUriForHref(this.details)[0],
      });
    event.cancelBubble = true;
    const internalResourceId = this._source.internalResourceId.outbound[0].uri;
    // we need to replace the # with the encoded character %23,
    // otherwise the value can not be passed as query parameter
    const encodedId = internalResourceId.replace(new RegExp('(\#)', "g"), "%23");
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    const url = `${environment.kgeUrl}?store=colid&profile=colid&baseNode=${encodedId}`;
    window.open(url, '_blank');
  }

  preventOpeningResultDetails(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  toggleShowingNested(key: string) {
    if (this.toggledNested[key]) {
      this.toggledNested[key] = false;
    } else {
      this.toggledNested[key] = true;
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

    this.details = orderable;
  }

  onResultClicked(): void {
    this.toggled = true;
    this.logger.info("DMP_RESULT_PAGE_RESOURCE_CLICKED",
      {
        'searchText': this.searchText,
        'searchTimestamp': this.searchTimestamp,
        'resourcePIDUri': getPidUriForHref(this.details)[0],
        'resourceLastChangeDate': getValueForKey(this.details, Constants.Metadata.LastChangeDateTime)[0],
        'clickedLinkType': this._source[Constants.Metadata.EntityType].outbound[0].uri,
        'clickedLinkCategory': 'https://pid.bayer.com/kos/19050/PID_Concept'
      });
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
      data: { id: version.value[Constants.Metadata.HasPidUri].value }
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
      'clickedLinkCategory': 'https://pid.bayer.com/kos/19050/PID_Concept'
    }
  }

  GetMetadataOfDistributionEndpoint(distributionEndpoint) {
    var label = getValueForKey(distributionEndpoint, Constants.Metadata.EntityType);
    return this.metadata['https://pid.bayer.com/kos/19050/distribution'].nestedMetadata.find(m => m.label == label[0]);
  }

  parseItemsToDetailsList(items: DocumentMap, parentKey: string, highlights: StringArrayMap): DetailsViewModel[] {
    const orderable: DetailsViewModel[] = [];

    for (const key of Object.keys(items)) {
      const item: DocumentMapDirection = items[key];
      if (parentKey && key === Constants.Metadata.HasLabel) {
      }
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
    } else if (key === 'https://pid.bayer.com/kos/19050/hasVersions') {
      this.versions = item;
      return null;
    } else if (key === 'https://pid.bayer.com/kos/19050/baseURIPointsAt') {
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
        this.subjectPidUriMap.set(n.uri, n.value[Constants.Metadata.HasPidUri].outbound[0].value);

        return { edge: n.edge, value: parsedItem };
      });

      nestedHighlighting = highlightingForNestedObject(highlight, key, "inbound")
      nestedInbound = item.inbound.map(n => {
        var parsedItem = this.parseItemsToDetailsList(n.value, n.edge, nestedHighlighting);
        this.subjectPidUriMap.set(n.uri, n.value[Constants.Metadata.HasPidUri].outbound[0].value);

        return { edge: n.edge, value: parsedItem };
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
            case 10: this.label = value; return null;
            case 20: this.definitionHighlight = value; return null;
          }
        }
      }

      // Only set in main resource and not in nested, since propertyKey is only set for nested properties.
      if (metaProps[Constants.Metadata.HasPidUri] === Constants.Metadata.HasPidUri || metaProps[Constants.Metadata.HasPidUri] === Constants.Metadata.HasBaseUri) {
        valueForHref = item.outbound.map(t => t.value);
      }

      // Only set in main resource and not in nested, since propertyKey is only set for nested properties.
      if (propertyKey === null && metaProps[Constants.Metadata.HasPidUri] === Constants.Metadata.EntityType) {
        this.resourceType = item.outbound.map(t => t.uri);
      }

      let inputType = metaProps[Constants.Metadata.Datatype] === Constants.Metadata.Type.DateTime ? InputType.Date : InputType.HTML;
      if (!nestedField && valueForHref && value.some(t => t.startsWith("http://") || t.startsWith("https://"))) {
        inputType = InputType.Link;
      } else if (metaProps[Constants.Metadata.HasPidUri] === Constants.Metadata.HasVersion) {
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
        nestedInbound: nestedInbound
      };
    }
    return null;
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
}

export class DetailsViewModelNested {
  edge: string;
  value: DetailsViewModel[]
}

export enum InputType {
  HTML,
  Date,
  Link,
  Version
}
