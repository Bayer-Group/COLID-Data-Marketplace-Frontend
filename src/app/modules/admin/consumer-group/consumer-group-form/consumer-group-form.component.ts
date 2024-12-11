import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsumerGroupResultDTO } from 'src/app/shared/models/consumerGroups/consumer-group-result-dto';
import { ValidationResult } from 'src/app/shared/models/validation/validation-result';
import { EntityBase } from 'src/app/shared/models/entities/entity-base';
import {
  ConsumerGroupState,
  FetchConsumerGroupMetadata,
  FetchConsumerGroupDetails,
  DeleteConsumerGroup,
  SetConsumerGroup
} from 'src/app/states/consumer-group.state';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { HttpErrorResponse } from '@angular/common/http';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { Constants } from 'src/app/shared/constants';
import { FetchConsumerGroupsByUser } from 'src/app/states/user-info.state';
import { ConsumerGroupApiService } from 'src/app/core/http/consumer-group.api.service';
import { ConsumerGroupWriteResultCTO } from 'src/app/shared/models/consumerGroups/consumer-group-write-result-cto';
import { EntityFormStatus } from 'src/app/shared/components/entity-form/entity-form-status';

@Component({
  selector: 'app-consumer-group-form',
  templateUrl: './consumer-group-form.component.html',
  styleUrls: ['./consumer-group-form.component.css']
})
export class ConsumerGroupFormComponent implements OnInit, OnDestroy {
  @Select(ConsumerGroupState.getConsumerGroup)
  consumerGroup$: Observable<ConsumerGroupResultDTO>;
  @Select(ConsumerGroupState.getConsumerGroupMetadata)
  consumerGrouppMetadata$: Observable<Array<MetaDataProperty>>;

  @Input() isNew: boolean;

  entityId: string;

  label = 'consumer group';

  deletionText =
    'You are about to delete a consumer group. <br>' +
    'If the consumer group is not used, it will be completely deleted by this procedure. <br>' +
    'Otherwise, the group is set to status deprecated and can be reactivated later';

  validationResult: ValidationResult;

  entityType = Constants.ResourceTypes.ConsumerGroup;

  placeholder: any = {};

  consumerGroup: ConsumerGroupResultDTO;

  formStatus: EntityFormStatus = EntityFormStatus.INITIAL;

  consumerGroupSubscription: Subscription;
  actionSubscription: Subscription;

  get isActive() {
    return (
      this.consumerGroup != null &&
      this.consumerGroup.lifecycleStatus ===
        Constants.ConsumerGroup.LifecycleStatus.Active
    );
  }

  get isDeprecated() {
    return (
      this.consumerGroup != null &&
      this.consumerGroup.lifecycleStatus ===
        Constants.ConsumerGroup.LifecycleStatus.Deprecated
    );
  }

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private snackBar: ColidMatSnackBarService,
    private router: Router,
    private consumerGroupService: ConsumerGroupApiService
  ) {}

  ngOnInit() {
    this.setPlaceholder();
    this.entityId = this.route.snapshot.queryParamMap.get('id');
    this.fetchingMetadata();

    if (this.entityId != null) {
      this.fetchingEntityDetails();
    }
    this.consumerGroupSubscription = this.consumerGroup$.subscribe((cg) => {
      this.consumerGroup = cg;
    });
  }

  ngOnDestroy() {
    this.consumerGroupSubscription.unsubscribe();
  }

  setPlaceholder() {
    this.placeholder[Constants.ConsumerGroup.HasConsumerGroupLifecycleStatus] =
      Constants.ConsumerGroup.LifecycleStatus.Active;
  }

  fetchingMetadata() {
    this.store.dispatch(new FetchConsumerGroupMetadata()).subscribe();
  }

  fetchingEntityDetails() {
    this.store
      .dispatch(new FetchConsumerGroupDetails(this.entityId))
      .subscribe();
  }

  handleCreateEntityEmitter(entity: EntityBase) {
    this.formStatus = EntityFormStatus.LOADING;

    this.consumerGroupService.createEntity(entity).subscribe(
      (res: ConsumerGroupWriteResultCTO) => {
        this.handleSuccessProcess(res);
        this.snackBar.success('Consumer Group', 'Created successfully');
      },
      (error) => {
        this.handleResponseError(error);
      }
    );
  }

  handleEditEntityEmitter(event: any) {
    this.formStatus = EntityFormStatus.LOADING;
    this.consumerGroupService.editEntity(event.id, event.entity).subscribe(
      (res: ConsumerGroupWriteResultCTO) => {
        this.handleSuccessProcess(res);
        this.snackBar.success('Consumer Group', 'Edited successfully');
      },
      (error) => {
        this.handleResponseError(error);
      }
    );
  }

  handleDeleteEntityEmitter(id: string) {
    this.formStatus = EntityFormStatus.LOADING;
    this.store.dispatch(new DeleteConsumerGroup(id)).subscribe(
      () => {
        this.snackBar.success('Consumer Group', 'Deleted successfully');
        this.router.navigate(['admin', 'consumerGroups']);
      },
      (error) => {
        this.handleResponseError(error);
      }
    );
  }

  handleSuccessProcess(entityWriteResult: ConsumerGroupWriteResultCTO) {
    this.formStatus = EntityFormStatus.SUCCESS;
    this.isNew = false;

    this.store
      .dispatch([
        new FetchConsumerGroupsByUser(),
        new SetConsumerGroup(entityWriteResult.entity)
      ])
      .subscribe();

    if (entityWriteResult != null) {
      if (entityWriteResult.validationResult.conforms) {
        this.router.navigate(['admin', 'consumerGroups']);
      } else {
        this.validationResult = entityWriteResult.validationResult;
      }
    }
  }

  handleCancelEditEntityEmitter() {
    this.router.navigate(['admin', 'consumerGroups']);
  }

  handleResponseError(error: HttpErrorResponse) {
    this.formStatus = EntityFormStatus.ERROR;

    if (error.status === 400 && error.error && error.error.validationResult) {
      this.validationResult = error.error.validationResult;
    }
  }
}
