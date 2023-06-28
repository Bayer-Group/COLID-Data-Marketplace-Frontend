import { Component, OnInit, OnDestroy } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import {
  PidUriTemplateState,
  DeletePidUriTemplate,
  CreatePidUriTemplate,
  EditPidUriTemplate,
  ReactivatePidUriTemplate,
} from "src/app/states/pid-uri-template.state";
import { Observable, Subscription } from "rxjs";
import { PidUriTemplateResultDTO } from "src/app/shared/models/pidUriTemplates/pid-uri-template-result-dto";
import { MetaDataProperty } from "src/app/shared/models/metadata/meta-data-property";
import { UntypedFormGroup, UntypedFormBuilder } from "@angular/forms";
import { FormItemSettings } from "src/app/shared/models/form/form-item-settings";
import { DeleteItemDialogComponent } from "src/app/shared/components/delete-item-dialog/delete-item-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { ValidationResult } from "src/app/shared/models/validation/validation-result";
import { ColidMatSnackBarService } from "src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service";
import { EntityFormService } from "src/app/shared/services/entity-form.service";
import { Constants } from "src/app/shared/constants";
import { EntityFormStatus } from "src/app/shared/components/entity-form/entity-form-status";

export enum PidUriTemplateAction {
  CREATE = "create",
  SAVE = "save",
  DELETE = "delete",
  REACTIVATE = "reactivate",
}

@Component({
  selector: "app-pid-uri-template-table",
  templateUrl: "./pid-uri-template-table.component.html",
  styleUrls: ["./pid-uri-template-table.component.css"],
})
export class PidUriTemplateTableComponent implements OnInit, OnDestroy {
  @Select(PidUriTemplateState.getPidUriTemplate)
  pidUriTemplate$: Observable<PidUriTemplateResultDTO>;
  @Select(PidUriTemplateState.getPidUriTemplateMetadata)
  pidUriTemplateMetadata$: Observable<Array<MetaDataProperty>>;
  @Select(PidUriTemplateState.getPidUriTemplates) pidUriTemplates$: Observable<
    Array<PidUriTemplateResultDTO>
  >;

  entityStatus: EntityFormStatus = EntityFormStatus.INITIAL;
  entityAction: PidUriTemplateAction;

  metaData: Array<MetaDataProperty>;
  pidUriTemplateForm: UntypedFormGroup;
  selectedForEdit: PidUriTemplateResultDTO;
  pidUriConstant = Constants.Metadata.HasPidUri;
  constants = Constants;
  placeholder = {};
  entityType = Constants.ResourceTypes.PidUriTemplate;

  formItemSettings: FormItemSettings = {
    debounceTime: 500,
  };

  pidUriTemplateMetadataSubscription: Subscription;

  get isLoading(): boolean {
    return this.entityStatus === EntityFormStatus.LOADING;
  }

  get f() {
    return this.pidUriTemplateForm.controls;
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private store: Store,
    private snackbar: ColidMatSnackBarService,
    private entityFormService: EntityFormService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.setPlaceholder();
    this.pidUriTemplateMetadataSubscription =
      this.pidUriTemplateMetadata$.subscribe((res) => {
        if (res) {
          this.metaData = res
            .filter(
              (r) =>
                r.properties[this.pidUriConstant] !==
                Constants.Metadata.EntityType
            )
            .sort(
              (a, b) =>
                a.properties[Constants.Metadata.Order] -
                b.properties[Constants.Metadata.Order]
            );
        }
        if (this.metaData) {
          this.buildForm();
        }
      });
  }

  ngOnDestroy() {
    this.pidUriTemplateMetadataSubscription.unsubscribe();
  }

  isCurrentEntity(
    pidUriTemplate: PidUriTemplateResultDTO,
    action: string = null
  ) {
    return (
      this.isLoading &&
      action === this.entityAction &&
      (pidUriTemplate === null || this.selectedForEdit === pidUriTemplate)
    );
  }

  setPlaceholder() {
    this.placeholder[Constants.PidUriTemplate.HasBaseUrl] = [
      Constants.PidUriTemplate.BaseUrl,
    ];
    this.placeholder[
      Constants.PidUriTemplate.HasPidUriTemplateLifecycleStatus
    ] = [Constants.PidUriTemplate.LifecycleStatus.Active];
  }

  buildForm(): void {
    const formBuilderGroup = {};

    for (const m of this.metaData) {
      formBuilderGroup[m.properties[this.pidUriConstant]] = [
        m.properties[this.pidUriConstant],
      ];
    }

    this.pidUriTemplateForm = this.formBuilder.group(formBuilderGroup);

    for (const m of this.metaData) {
      if (
        m.properties[Constants.Metadata.ControlledVocabulary] &&
        m.properties[Constants.Metadata.ControlledVocabulary].length
      ) {
        this.pidUriTemplateForm.controls[
          m.properties[this.pidUriConstant]
        ].setValue(
          m.properties[Constants.Metadata.ControlledVocabulary][0].key
        );
      } else {
        const customPlaceholder =
          this.placeholder[m.properties[this.pidUriConstant]];
        const shaclPlaceholder = m.properties[Constants.Shacl.DefaultValue];
        const placeholder =
          customPlaceholder == null ? shaclPlaceholder : customPlaceholder;
        this.pidUriTemplateForm.controls[
          m.properties[this.pidUriConstant]
        ].setValue(placeholder);
      }
    }
  }

  fillForm() {
    if (this.selectedForEdit) {
      Object.keys(this.selectedForEdit.properties).forEach((key) => {
        const formItem = this.pidUriTemplateForm.controls[key];
        if (formItem) {
          formItem.setValue(this.selectedForEdit.properties[key]);
        }
      });
    }
  }

  confirmAndDelete(pidUriTemplate) {
    const dialogRef = this.dialog.open(DeleteItemDialogComponent, {
      data: {
        header: "Deleting PID URI template",
        body:
          "You are about to delete a pid uri template. <br>" +
          "If the template is not used, it will be completely deleted by this procedure. <br>" +
          "Otherwise, the template is set to status deprecated and can be reactivated later",
      },
      width: "auto",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.delete(pidUriTemplate);
      }
    });
  }

  delete(pidUriTemplate) {
    this.entityStatus = EntityFormStatus.LOADING;
    this.entityAction = PidUriTemplateAction.DELETE;

    this.store.dispatch(new DeletePidUriTemplate(pidUriTemplate.id)).subscribe(
      () => {
        this.entityStatus = EntityFormStatus.SUCCESS;
        this.snackbar.success("PID URI template", "Deleted successfully");
      },
      (error) => {
        this.handleResponseError(error);
      }
    );
  }

  create() {
    this.entityStatus = EntityFormStatus.LOADING;
    this.entityAction = PidUriTemplateAction.CREATE;

    const formProperties = Object.entries(this.pidUriTemplateForm.value);
    const pidUriTemplate = this.entityFormService.createEntity(
      formProperties,
      this.metaData,
      this.entityType
    );
    this.store.dispatch(new CreatePidUriTemplate(pidUriTemplate)).subscribe(
      () => {
        this.buildForm();
        this.entityStatus = EntityFormStatus.SUCCESS;
        this.snackbar.success("PID URI template", "Created successfully");
      },
      (error) => {
        this.handleResponseError(error);
      }
    );
  }

  selectForEdit(p) {
    this.selectedForEdit = p;
    this.fillForm();
  }

  editPidUriTemplate() {
    this.entityStatus = EntityFormStatus.LOADING;
    this.entityAction = PidUriTemplateAction.SAVE;

    const formProperties = Object.entries(this.pidUriTemplateForm.value);
    const pidUriTemplate = this.entityFormService.createEntity(
      formProperties,
      this.metaData,
      this.entityType
    );
    this.store
      .dispatch(new EditPidUriTemplate(this.selectedForEdit.id, pidUriTemplate))
      .subscribe(
        () => {
          this.cancelEditing();
          this.entityStatus = EntityFormStatus.SUCCESS;
          this.snackbar.success("PID URI template", "Edited successfully");
        },
        (error) => {
          this.handleResponseError(error);
        }
      );
  }

  reactivate(pidUriTemplate: PidUriTemplateResultDTO) {
    this.entityStatus = EntityFormStatus.LOADING;
    this.entityAction = PidUriTemplateAction.REACTIVATE;

    this.store
      .dispatch(new ReactivatePidUriTemplate(pidUriTemplate.id))
      .subscribe(
        () => {
          this.entityStatus = EntityFormStatus.SUCCESS;
          this.snackbar.success(
            "PID URI template",
            "Reactivation successfully"
          );
        },
        (error) => {
          this.handleResponseError(error);
        }
      );
  }

  cancelEditing() {
    this.selectedForEdit = null;
    this.buildForm();
  }

  isReadOnly(metadataKey) {
    if (metadataKey === Constants.PidUriTemplate.HasBaseUrl) {
      return true;
    }
    return null;
  }

  handleResponseError(error) {
    if (error.status === 400 && error.error && error.error.validationResult) {
      this.showValidationResult(error.error.validationResult);
    }
    this.entityStatus = EntityFormStatus.ERROR;
  }

  showValidationResult(validationResult: ValidationResult) {
    validationResult.results.forEach((result) => {
      this.pidUriTemplateForm.controls[result.path].setErrors({
        incorrect: true,
        result: result,
      });
    });
  }

  isTemplateDeprecated(template: PidUriTemplateResultDTO) {
    var status =
      template.properties[
        Constants.PidUriTemplate.HasPidUriTemplateLifecycleStatus
      ];

    return (
      status != null &&
      status.some(
        (s) => s === Constants.PidUriTemplate.LifecycleStatus.Deprecated
      )
    );
  }
}
