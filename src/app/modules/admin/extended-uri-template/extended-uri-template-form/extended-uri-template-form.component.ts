import { Component, OnInit, Input } from '@angular/core';
import {
  ExtendedUriTemplateState,
  FetchExtendedUriTemplateMetadata,
  FetchExtendedUriTemplateDetails,
  CreateExtendedUriTemplate,
  EditExtendedUriTemplate,
  DeleteExtendedUriTemplate
} from 'src/app/states/extended-uri-template.state';
import { Select, Store } from '@ngxs/store';
import { ExtendedUriTemplateResultDTO } from 'src/app/shared/models/extendedUriTemplates/extended-uri-template-result-dto';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidationResult } from 'src/app/shared/models/validation/validation-result';
import { EntityBase } from 'src/app/shared/models/entities/entity-base';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Constants } from 'src/app/shared/constants';
import { EntityFormStatus } from 'src/app/shared/components/entity-form/entity-form-status';

@Component({
  selector: 'app-extended-uri-template-form',
  templateUrl: './extended-uri-template-form.component.html',
  styleUrls: ['./extended-uri-template-form.component.css']
})
export class ExtendedUriTemplateFormComponent implements OnInit {
  @Select(ExtendedUriTemplateState.getExtendedUriTemplate)
  extendedUriTemplate$: Observable<ExtendedUriTemplateResultDTO>;

  @Select(ExtendedUriTemplateState.getExtendedUriTemplateMetadata)
  extendedUriTemplatepMetadata$: Observable<Array<MetaDataProperty>>;

  @Input() isNew: boolean;

  validationResult: ValidationResult;

  entityId: string;

  label = 'extended URI template';

  formStatus: EntityFormStatus = EntityFormStatus.INITIAL;

  entityType = Constants.ResourceTypes.ExtendedUriTemplate;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private snackBar: ColidMatSnackBarService,
    private router: Router
  ) {}

  ngOnInit() {
    this.entityId = this.route.snapshot.queryParamMap.get('id');
    this.fetchingMetadata();

    if (this.entityId != null) {
      this.fetchingEntityDetails();
    }
  }

  fetchingMetadata() {
    this.store.dispatch(new FetchExtendedUriTemplateMetadata()).subscribe();
  }

  fetchingEntityDetails() {
    this.store
      .dispatch(new FetchExtendedUriTemplateDetails(this.entityId))
      .subscribe();
  }

  handleCreateEntityEmitter(entity: EntityBase) {
    this.formStatus = EntityFormStatus.LOADING;

    this.store.dispatch(new CreateExtendedUriTemplate(entity)).subscribe(
      () => {
        this.formStatus = EntityFormStatus.SUCCESS;
        this.snackBar.success('Extended URI template', 'Created successfully');
        this.router.navigate([`admin/extendedUriTemplates`]);
      },
      (error) => {
        this.handleResponseError(error);
      }
    );
  }

  handleEditEntityEmitter(event: any) {
    this.formStatus = EntityFormStatus.LOADING;

    const id = event.id;
    const entityBase = event.entity;

    this.store.dispatch(new EditExtendedUriTemplate(id, entityBase)).subscribe(
      () => {
        this.formStatus = EntityFormStatus.SUCCESS;
        this.snackBar.success('Extended URI template', 'Edited successfully');
        this.router.navigate([`admin/extendedUriTemplates`]);
      },
      (error) => {
        this.handleResponseError(error);
      }
    );
  }

  handleDeleteEntityEmitter(id: string) {
    this.formStatus = EntityFormStatus.LOADING;

    this.store.dispatch(new DeleteExtendedUriTemplate(id)).subscribe(
      () => {
        this.formStatus = EntityFormStatus.SUCCESS;
        this.snackBar.success('Extended URI template', 'Deleted successfully');
        this.router.navigate(['admin', 'extendedUriTemplates']);
      },
      (error) => {
        this.handleResponseError(error);
      }
    );
  }

  handleCancelEditEntityEmitter() {
    this.formStatus = EntityFormStatus.INITIAL;
    this.router.navigate(['admin', 'extendedUriTemplates']);
  }

  handleResponseError(error: HttpErrorResponse) {
    this.formStatus = EntityFormStatus.ERROR;

    if (error.status === 400 && error.error && error.error.validationResult) {
      this.validationResult = error.error.validationResult;
    }
  }
}
