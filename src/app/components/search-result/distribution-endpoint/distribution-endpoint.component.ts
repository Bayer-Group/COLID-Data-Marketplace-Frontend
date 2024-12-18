import { Component, OnInit, Input } from '@angular/core';
import { DetailsViewModel } from '../search-result.component';
import {
  getValueForKey,
  getPidUriForHref,
  getUriForKey
} from 'src/app/shared/operators/document-operators';
import { LogService } from 'src/app/core/logging/log.service';
import { Observable } from 'rxjs';
import { SearchState } from 'src/app/states/search.state';
import { Select } from '@ngxs/store';
import { Constants } from 'src/app/shared/constants';
import { ViewDescriptionDialogComponent } from '../../search-result/view-description-dialog/view-description-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-distribution-endpoint',
  templateUrl: './distribution-endpoint.component.html',
  styleUrls: ['./distribution-endpoint.component.scss']
})
export class DistributionEndpointComponent implements OnInit {
  @Input() resource: DetailsViewModel[];
  @Input() endpoint: DetailsViewModel[];
  @Input() metadata: any;
  @Input() baseUriPointsAt: string;
  @Input() lastElement: boolean;
  @Select(SearchState.getSearchText) searchTextObservable$: Observable<string>;
  @Select(SearchState.getSearchTimestamp)
  searchTimestampObservable$: Observable<Date>;

  constants = Constants;
  invisibleProperties: Array<string> = [
    Constants.Metadata.EntityType,
    Constants.Metadata.HasTargetUri,
    Constants.Metadata.HasNetworkedResourceLabel
  ];

  sortedMetadataProperties: any;

  description: string;
  pidUrlForHref: string;
  label: string;
  distributionType: string;
  distributionTypeKey: string;

  searchText: string;
  searchTimestamp: Date;

  metaLabel: string;
  comment: string;
  metaDescription: string;

  constructor(
    private logger: LogService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    if (this.metadata) {
      this.description = this.metadata.description;
    }
    this.label = getValueForKey(
      this.endpoint,
      Constants.Metadata.HasNetworkedResourceLabel
    )[0];
    this.distributionType = getValueForKey(
      this.endpoint,
      Constants.Metadata.EntityType
    )[0];
    this.distributionTypeKey = getUriForKey(
      this.endpoint,
      Constants.Metadata.EntityType
    )[0];
    this.pidUrlForHref = getPidUriForHref(this.endpoint)[0];
    this.sortedMetadataProperties = this.metadata.properties
      .slice()
      .sort((left, right) => {
        const orderCompare =
          left.properties[Constants.Shacl.Order] -
          right.properties[Constants.Shacl.Order];
        return orderCompare;
      });

    // filter out broken distribution point properties when no data is available for these properties
    if (
      !this.endpoint.find(
        (x) => x.key === Constants.Metadata.HasBrokenDistributionEndpointLink
      )
    ) {
      let index = this.sortedMetadataProperties.findIndex(
        (metadata) =>
          metadata.key === Constants.Metadata.HasBrokenDistributionEndpointLink
      );
      if (index > -1) {
        this.sortedMetadataProperties.splice(index, 1);
      }
    }
    if (
      !this.endpoint.find(
        (x) => x.key === Constants.Metadata.HasBrokenEndpointContact
      )
    ) {
      let index = this.sortedMetadataProperties.findIndex(
        (metadata) =>
          metadata.key === Constants.Metadata.HasBrokenEndpointContact
      );
      if (index > -1) {
        this.sortedMetadataProperties.splice(index, 1);
      }
    }

    this.searchTextObservable$.subscribe((searchText) => {
      this.searchText = searchText;
    });

    this.searchTimestampObservable$.subscribe((searchTimestamp) => {
      this.searchTimestamp = searchTimestamp;
    });
  }

  GetMetadataKey(metadataProperty: any): any {
    return metadataProperty.properties[Constants.Metadata.HasPidUri];
  }

  IsVisibleProperty(metadataProperty: any): boolean {
    const key = this.GetMetadataKey(metadataProperty);

    if (this.invisibleProperties.includes(key)) {
      return false;
    }

    return true;
  }

  GetDistributionEndpointProperty(metadataProperty: any): DetailsViewModel {
    const key = this.GetMetadataKey(metadataProperty);
    return this.endpoint.find((prop) => prop.key === key);
  }

  GetDistributionEndpointPropertyValue(metadataProperty: any): string[] {
    const property = this.GetDistributionEndpointProperty(metadataProperty);
    if (property == undefined) return undefined;

    return property.value;
  }

  onLinkClicked(event: Event): void {
    event.preventDefault();
    window.open(this.pidUrlForHref, '_blank');

    this.logger.info(
      'DMP_RESULT_PAGE_RESOURCE_DISTRIBUTION_ENDPOINT_LINK_CLICKED',
      {
        searchText: this.searchText,
        searchTimestamp: this.searchTimestamp,
        resourcePIDUri: getPidUriForHref(this.resource)[0],
        resourceLastChangeDate: getValueForKey(
          this.resource,
          Constants.Metadata.LastChangeDateTime
        )[0],
        clickedLink: this.pidUrlForHref,
        clickedLinkEdge: Constants.Metadata.HasPidUri,
        clickedLinkType: this.endpoint.find(
          (d) => d.key === Constants.Metadata.EntityType
        ).valueEdge[0],
        clickedLinkCategory: Constants.DistributionEndpoint.DistributionKey
      }
    );
  }

  openMetaDescriptionDialog(comment, metalabel, metaDescription) {
    if (comment || metaDescription) {
      this.dialog.open(ViewDescriptionDialogComponent, {
        width: '450px',
        height: 'auto',
        data: {
          comment: comment,
          label: metalabel,
          description: metaDescription
        }
      });
    }
  }
}
