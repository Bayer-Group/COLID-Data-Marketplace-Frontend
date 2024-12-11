import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Select, Store } from '@ngxs/store';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { Constants } from 'src/app/shared/constants';
import { ColidEntrySubscriptionDto } from 'src/app/shared/models/user/colid-entry-subscription-dto';
import {
  AddColidEntrySubscription,
  RemoveColidEntrySubscription
} from 'src/app/states/user-info.state';
import { FavoritesState } from '../../favorites/favorites.state';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddFavoriteDialogComponent } from '../../favorites/components/add-favorite-dialog/add-favorite-dialog.component';
import { LogService } from 'src/app/core/logging/log.service';
import { environment } from 'src/environments/environment';
import { DetailsViewModel } from '../search-result.component';
import { EditorAccessControlDirective } from 'src/app/shared/directives/editor-access-control.directive';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { DeleteItemDialogComponent } from 'src/app/shared/components/delete-item-dialog/delete-item-dialog.component';
import {
  DeleteDraftResource,
  MarkResourceAsDeleted,
  UnlinkResource
} from 'src/app/states/resource.state';
import { SimpleInformationDialogComponent } from 'src/app/shared/components/simple-information-dialog/simple-information-dialog.component';
import { FetchSearchResult } from 'src/app/states/search.state';
import { ActivatedRoute } from '@angular/router';
import { ResourceCreationType } from 'src/app/shared/models/resources/resource-creation-type';
import { DocumentMap } from 'src/app/shared/models/search-result';

// TODO: Unify - duplicate code with colid-ui-resource-relationship-manager-frontend
@Component({
  selector: 'app-resource-operations-buttons',
  standalone: true,
  imports: [
    EditorAccessControlDirective,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger
  ],
  templateUrl: './resource-operations-buttons.component.html',
  styleUrl: './resource-operations-buttons.component.scss'
})
export class ResourceOperationsButtonsComponent implements OnInit, OnChanges {
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

  @Select(FavoritesState.getFavoriteUriList)
  favUris$: Observable<string[]>;

  isFavorited: boolean = false;

  get isSubscribed(): boolean {
    return this.colidEntrySubscriptions?.some(
      (ces) => ces.colidPidUri === this.pidUri
    );
  }

  get subscriptionButtonTooltip(): string {
    return this.isSubscribed
      ? 'Unsubscribe from resource'
      : 'Subscribe to resource';
  }

  get subscriptionButtonIcon(): string {
    return this.isSubscribed ? 'notifications_active' : 'notifications_none';
  }

  get hasDraftVersion(): boolean {
    return (
      this.entryLifeCycleStatus === Constants.Resource.LifeCycleStatus.Draft
    );
  }

  get hasPublishedVersion(): boolean {
    return (
      this.entryLifeCycleStatus === Constants.Resource.LifeCycleStatus.Published
    );
  }

  get hasLinkedDraftOrPublishedVersion(): boolean {
    const statuses = [
      Constants.Resource.LifeCycleStatus.Published,
      Constants.Resource.LifeCycleStatus.Draft
    ];

    return statuses.includes(this.resourceLinkedLifecycleStatus);
  }

  get showDeleteDraftButton(): boolean {
    return this.hasDraftVersion || this.hasLinkedDraftOrPublishedVersion;
  }

  get showMarkForDeletionButton(): boolean {
    return this.hasPublishedVersion && !this.hasLinkedDraftOrPublishedVersion;
  }

  get hasLaterVersion() {
    return this.source && Constants.Metadata.HasLaterVersion in this.source;
  }

  get showUnlinkButton(): boolean {
    return (
      this.source?.[Constants.Metadata.HasVersions]?.inbound.length > 0 ||
      this.source?.[Constants.Metadata.HasVersions]?.outbound.length > 0
    );
  }

  get favoritesButtonTooltip(): string {
    return this.isFavorited ? 'Manage favorites' : 'Add to favorites';
  }

  get favoritesButtonIcon(): string {
    return this.isFavorited ? 'bookmark_active' : 'bookmark_border_none';
  }

  constructor(
    private store: Store,
    private snackBar: ColidMatSnackBarService,
    private dialog: MatDialog,
    private logger: LogService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.favUris$.subscribe((r) => {
      this.isFavorited = r.indexOf(this.pidUri) > -1;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.pidUri?.currentValue) {
      this.pidUri = changes?.pidUri?.currentValue;
    }

    if (changes?.details?.currentValue) {
      this.details = changes?.details?.currentValue;
    }

    if (changes?.source?.currentValue) {
      this.source = changes?.source?.currentValue;
    }

    if (changes?.entryLifeCycleStatus?.currentValue) {
      this.entryLifeCycleStatus = changes?.entryLifeCycleStatus?.currentValue;
    }

    if (changes?.resourceLinkedLifecycleStatus?.currentValue) {
      this.resourceLinkedLifecycleStatus =
        changes?.resourceLinkedLifecycleStatus?.currentValue;
    }

    if (changes?.colidEntrySubscriptions?.currentValue) {
      this.colidEntrySubscriptions =
        changes?.colidEntrySubscriptions?.currentValue;
    }

    if (changes?.searchText?.currentValue) {
      this.searchText = changes?.searchText?.currentValue;
    }

    if (changes?.searchTimestamp?.currentValue) {
      this.searchTimestamp = changes?.searchTimestamp?.currentValue;
    }

    if (changes?.entityType?.currentValue) {
      this.entityType = changes?.entityType?.currentValue;
    }
  }

  openInColidEditor(event) {
    event.stopPropagation();

    this.logger.info('PID_RESULT_PAGE_RESOURCE_EDIT_CLICKED', {
      searchText: this.searchText,
      searchTimestamp: this.searchTimestamp,
      resourcePIDUri: this.pidUri
    });

    window.open(
      `${environment.pidUrl}resource/edit?pidUri=${this.sanitizeUri(this.pidUri)}`,
      '_blank'
    );
  }

  changeResourceType() {
    window.open(
      `${environment.pidUrl}resource?pidUri=${this.sanitizeUri(this.pidUri)}&openChangeResourceTypeDialog=true`,
      '_blank'
    );
  }

  deleteDraftResource() {
    const dialogRef = this.dialog.open(DeleteItemDialogComponent, {
      data: {
        header: 'Deleting COLID entry draft',
        body: 'Are you sure that you want to delete this COLID entry draft?'
      },
      width: 'auto',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => {
      this.store
        .dispatch(new DeleteDraftResource(this.pidUri))
        .subscribe(() => {
          this.snackBar.success(
            'COLID draft entry deleted',
            'Deleted successfully'
          );

          this.dialog.open(SimpleInformationDialogComponent, {
            data: {
              header: 'COLID draft entry deleted',
              body: 'It might take some time until the changes are visible in the search. If the changes are not visible yet, please reload the page'
            }
          });

          setTimeout(() => {
            this.store.dispatch(new FetchSearchResult(this.route));
          }, 2000);
        });
    });
  }

  markResourceForDeletion() {
    this.store
      .dispatch(new MarkResourceAsDeleted(this.pidUri))
      .subscribe(() => {
        this.snackBar.success(
          'Resource marked for deletion',
          'The resource has been marked for deletion. An administrator will review your request soon.'
        );

        this.dialog.open(SimpleInformationDialogComponent, {
          data: {
            header: 'Resource marked for deletion',
            body: 'It might take some time until the changes are visible in the search. If the changes are not visible yet, please reload the page'
          }
        });

        setTimeout(() => {
          this.store.dispatch(new FetchSearchResult(this.route));
        }, 2000);
      });
  }

  linkResource() {
    window.open(
      `${environment.pidUrl}resource?pidUri=${this.sanitizeUri(this.pidUri)}&openLinkingDialog=true`,
      '_blank'
    );
  }

  unlinkResource() {
    this.store.dispatch(new UnlinkResource(this.pidUri)).subscribe(() => {
      this.snackBar.success(
        'Resource unlinked',
        'The resource has been unlinked from the list successfully.'
      );

      this.dialog.open(SimpleInformationDialogComponent, {
        data: {
          header: 'Resource unlinked',
          body: 'It might take some time until the changes are visible in the search. If the changes are not visible yet, please reload the page'
        }
      });

      setTimeout(() => {
        this.store.dispatch(new FetchSearchResult(this.route));
      }, 2000);
    });
  }

  createNewVersion() {
    window.open(
      `${environment.pidUrl}resource/new` +
        `?type=${encodeURIComponent(this.entityType)}` +
        `&based=${this.sanitizeUri(this.pidUri)}` +
        `&creationType=${ResourceCreationType.NEWVERSION}`,
      '_blank'
    );
  }

  copyResource() {
    const url =
      `${environment.pidUrl}resource/new` +
      `?type=${encodeURIComponent(this.entityType)}` +
      `&based=${this.sanitizeUri(this.pidUri)}` +
      `&creationType=${ResourceCreationType.COPY}`;
    window.open(url, '_blank');
  }

  handleSubscriptionButtonClick(event: Event): void {
    this.isSubscribed
      ? this.unsubscribeFromResource(event)
      : this.subscribeToResource(event);
  }

  openFavoritesDialog(event) {
    event.stopPropagation();

    this.dialog.open(AddFavoriteDialogComponent, {
      height: '400px',
      width: '500px',
      data: {
        pidUri: this.pidUri,
        multiSelect: false
      }
    });
  }

  openInResourceRelationshipManager(event) {
    event.stopPropagation();

    this.logger.info('DMP_RESULT_PAGE_RESOURCE_RRM_CLICKED', {
      searchText: this.searchText,
      searchTimestamp: this.searchTimestamp,
      resourcePIDUri: this.pidUri
    });

    window.open(
      `${environment.rrmUrl}?baseNode=${this.sanitizeUri(this.pidUri)}`,
      '_blank'
    );
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  /**
   * We need to replace the # with the encoded character %23,
   * otherwise the value can not be passed as query parameter
   */
  private sanitizeUri(uri: string): string {
    return uri.replace(new RegExp('(#)', 'g'), '%23');
  }

  private subscribeToResource(event: Event): void {
    this.stopPropagation(event);

    let colidEntrySubscriptionDto = new ColidEntrySubscriptionDto(this.pidUri);
    this.store
      .dispatch(new AddColidEntrySubscription(colidEntrySubscriptionDto))
      .subscribe(() => {
        this.snackBar.success(
          'Resource subscribed',
          'The resource has been subscribed successfully.'
        );
      });
  }

  private unsubscribeFromResource(event): void {
    event.stopPropagation();

    let colidEntrySubscriptionDto = new ColidEntrySubscriptionDto(this.pidUri);
    this.store
      .dispatch(new RemoveColidEntrySubscription(colidEntrySubscriptionDto))
      .subscribe(() => {
        this.snackBar.success(
          'Resource unsubscribed',
          'The resource has been unsubscribed successfully.'
        );
      });
  }
}
