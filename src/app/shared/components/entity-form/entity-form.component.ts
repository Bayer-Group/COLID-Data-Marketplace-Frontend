import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { MetaDataProperty } from "src/app/shared/models/metadata/meta-data-property";
import { Constants } from "src/app/shared/constants";
import { UntypedFormGroup, UntypedFormBuilder } from "@angular/forms";
import { FormItemSettings } from "src/app/shared/models/form/form-item-settings";
import { MatDialog } from "@angular/material/dialog";
import { DeleteItemDialogComponent } from "../delete-item-dialog/delete-item-dialog.component";
import { ValidationResult } from "src/app/shared/models/validation/validation-result";
import { EntityBase } from "src/app/shared/models/entities/entity-base";
import { Entity } from "src/app/shared/models/entities/entity";
import { EntityFormService } from "../../services/entity-form.service";
import { EntityFormStatus } from "./entity-form-status";

export enum EntityFormAction {
  CREATE = "create",
  SAVE = "save",
  DELETE = "delete",
}

@Component({
  selector: "app-entity-form",
  templateUrl: "./entity-form.component.html",
  styleUrls: ["./entity-form.component.scss"],
})
export class EntityFormComponent implements OnInit {
  @Input() label: string;

  _entity: Entity;

  @Input() set entity(entity: Entity) {
    this._entity = entity;
    this.fillForm();
  }

  @Input() metaData: Array<MetaDataProperty>;

  @Input() isNew: boolean;

  @Input() isDeletable: boolean;

  @Input() placeholder: any = {};

  @Input() deletionText: string;

  @Input() set validationResult(validationResult) {
    if (validationResult != null) {
      this.showValidationResult(validationResult);
    }
  }

  @Input() entityType: string;

  @Input() status: EntityFormStatus = EntityFormStatus.INITIAL;

  @Output() createEntityEmitter: EventEmitter<EntityBase> =
    new EventEmitter<EntityBase>();

  @Output() deleteEntityEmitter: EventEmitter<string> =
    new EventEmitter<string>();

  @Output() editEntityEmitter: EventEmitter<any> = new EventEmitter<any>();

  @Output() cancelEditEntityEmitter: EventEmitter<any> =
    new EventEmitter<any>();

  constants = Constants;

  entityForm: UntypedFormGroup = null;
  currentAction: EntityFormAction;

  get actionButtonDisabled(): boolean {
    return this.status === EntityFormStatus.LOADING;
  }

  get formReadOnly(): boolean {
    return this.status === EntityFormStatus.LOADING ? true : false;
  }

  actionButtonLoading(action: string): boolean {
    return this.actionButtonDisabled && this.currentAction == action;
  }

  formItemSettings: FormItemSettings = {
    debounceTime: 500,
  };

  get f() {
    return this.entityForm.controls;
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private entityFormService: EntityFormService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    const formBuilderGroup = {};

    for (const m of this.metaData) {
      formBuilderGroup[m.key] = [m.key];
    }

    this.entityForm = this.formBuilder.group(formBuilderGroup);

    for (const m of this.metaData) {
      const customPlaceholder =
        this.placeholder[m.properties[Constants.Metadata.HasPidUri]];
      const shaclPlaceholder = m.properties[Constants.Shacl.DefaultValue];
      const placeholder =
        customPlaceholder == null ? shaclPlaceholder : customPlaceholder;
      const value =
        m.key === Constants.Metadata.EntityType ? this.entityType : placeholder;
      this.entityForm.controls[
        m.properties[Constants.Metadata.HasPidUri]
      ].setValue(value);
    }

    this.fillForm();
  }

  fillForm() {
    if (this._entity && this.entityForm) {
      Object.keys(this._entity.properties).forEach((key) => {
        const formItem = this.entityForm.controls[key];
        if (formItem) {
          formItem.setValue(this._entity.properties[key]);
        }
      });
    }
  }

  createEntity() {
    this.currentAction = EntityFormAction.CREATE;
    this.status = EntityFormStatus.LOADING;

    const formProperties = Object.entries(this.entityForm.value);
    const entity = this.entityFormService.createEntity(
      formProperties,
      this.metaData,
      this.entityType
    );

    this.createEntityEmitter.emit(entity);
  }

  confirmAndDelete() {
    this.currentAction = EntityFormAction.DELETE;

    const dialogRef = this.dialog.open(DeleteItemDialogComponent, {
      data: {
        header: `Deleting ${this.label}`,
        body:
          this.deletionText ||
          `Are you sure you want to delete this ${this.label}?'`,
      },
      width: "auto",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteEntity();
      }
    });
  }

  showValidationResult(validationResult: ValidationResult) {
    validationResult.results.forEach((result) => {
      this.entityForm.controls[result.path].setErrors({
        incorrect: true,
        result: result,
      });
    });
  }

  deleteEntity() {
    this.status = EntityFormStatus.LOADING;
    this.deleteEntityEmitter.emit(this._entity.id);
  }

  editEntity() {
    this.currentAction = EntityFormAction.SAVE;
    this.status = EntityFormStatus.LOADING;

    const formProperties = Object.entries(this.entityForm.value);
    const entity = this.entityFormService.createEntity(
      formProperties,
      this.metaData,
      this.entityType
    );

    this.editEntityEmitter.emit({ id: this._entity.id, entity: entity });
  }

  cancelEditing() {
    this.cancelEditEntityEmitter.emit();
  }
}
