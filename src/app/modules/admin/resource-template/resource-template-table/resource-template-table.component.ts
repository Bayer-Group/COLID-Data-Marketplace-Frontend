import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { Store } from '@ngxs/store';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { ResourceTemplateResultDTO } from 'src/app/shared/models/resource-templates/resource-template-result-dto';
import { Constants } from 'src/app/shared/constants';
import { EntityFormStatus } from 'src/app/shared/components/entity-form/entity-form-status';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteItemDialogComponent } from 'src/app/shared/components/delete-item-dialog/delete-item-dialog.component';
import { EntityFormService } from 'src/app/shared/services/entity-form.service';
import {
  CreateResourceTemplate,
  DeleteResourceTemplate,
  EditResourceTemplate
} from 'src/app/states/resource-template.state';

export enum ResourceTemplateAction {
  CREATE = 'create',
  SAVE = 'save',
  DELETE = 'delete'
}

@Component({
  selector: 'app-resource-template-table',
  templateUrl: './resource-template-table.component.html',
  styleUrls: ['./resource-template-table.component.scss']
})
export class ResourceTemplateTableComponent implements OnInit {
  @Input() resourceTemplates: Array<ResourceTemplateResultDTO>;
  @Input() metaData: Array<MetaDataProperty>;
  @Input() resourceTypes: Array<{ id: string; label: string }>;

  entityStatus: EntityFormStatus = EntityFormStatus.INITIAL;
  entityAction: ResourceTemplateAction;
  entityType = Constants.ResourceTemplates.Type;

  resourceTemplateForm: UntypedFormGroup;
  selectedForEdit: ResourceTemplateResultDTO;
  constants = Constants;
  pidUriConstant = Constants.Metadata.HasPidUri;
  hasResourceTypeConstants = Constants.ResourceTemplates.HasResourceType;

  pageIndex: number = 0;
  pageSize: number = 8;

  constructor(
    private store: Store,
    private entityFormService: EntityFormService,
    private formBuilder: FormBuilder,
    private snackbar: ColidMatSnackBarService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.metaData = this.metaData.filter(
      (r) => r.properties[this.pidUriConstant] !== Constants.Metadata.EntityType
    );
    this.buildForm();
  }

  get f() {
    return this.resourceTemplateForm.controls;
  }

  get isLoading(): boolean {
    return this.entityStatus === EntityFormStatus.LOADING;
  }

  getResourceTypeLabel(id: string) {
    return this.resourceTypes.find((t) => t.id === id).label;
  }

  isCurrentEntity(
    resourceTemplate: ResourceTemplateResultDTO,
    action: string = null
  ) {
    return (
      this.isLoading &&
      action === this.entityAction &&
      (resourceTemplate === null || this.selectedForEdit === resourceTemplate)
    );
  }

  buildForm() {
    const formBuilderGroup = {};

    for (const m of this.metaData) {
      // resource type will be determined in the backend by the provided PID URI
      if (m.key === this.hasResourceTypeConstants) {
        formBuilderGroup[m.properties[this.pidUriConstant]] = new FormControl(
          ''
        );
      } else {
        formBuilderGroup[m.properties[this.pidUriConstant]] = new FormControl(
          '',
          [Validators.required]
        );
      }
    }

    this.resourceTemplateForm = this.formBuilder.group(formBuilderGroup);
  }

  create() {
    this.entityStatus = EntityFormStatus.LOADING;
    this.entityAction = ResourceTemplateAction.CREATE;

    const formProperties = Object.entries(this.resourceTemplateForm.value);
    const resourceTemplate = this.entityFormService.createEntity(
      formProperties,
      this.metaData,
      this.entityType
    );

    this.store.dispatch(new CreateResourceTemplate(resourceTemplate)).subscribe(
      () => {
        this.buildForm();
        this.entityStatus = EntityFormStatus.SUCCESS;
        this.snackbar.success('PID URI template', 'Created successfully');
      },
      (_) => {
        this.entityStatus = EntityFormStatus.ERROR;
      }
    );
  }

  selectForEdit(resourceTemplate) {
    this.selectedForEdit = resourceTemplate;
    this.fillForm();
  }

  cancelEditing() {
    this.selectedForEdit = null;
    this.buildForm();
  }

  editResourceTemplate() {
    this.entityStatus = EntityFormStatus.LOADING;
    this.entityAction = ResourceTemplateAction.SAVE;

    const formProperties = Object.entries(this.resourceTemplateForm.value);
    const resourceTemplate = this.entityFormService.createEntity(
      formProperties,
      this.metaData,
      this.entityType
    );
    this.store
      .dispatch(
        new EditResourceTemplate(this.selectedForEdit.id, resourceTemplate)
      )
      .subscribe(
        () => {
          this.cancelEditing();
          this.entityStatus = EntityFormStatus.SUCCESS;
          this.snackbar.success('Resource template', 'Edited successfully');
        },
        (_) => {
          this.entityStatus = EntityFormStatus.ERROR;
        }
      );
  }

  confirmAndDelete(resourceTemplate) {
    const dialogRef = this.dialog.open(DeleteItemDialogComponent, {
      data: {
        header: 'Deleting Resource template',
        body: 'You are about to delete a resource template'
      },
      width: 'auto',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.delete(resourceTemplate);
      }
    });
  }

  delete(resourceTemplate) {
    this.entityStatus = EntityFormStatus.LOADING;
    this.entityAction = ResourceTemplateAction.DELETE;

    this.store
      .dispatch(new DeleteResourceTemplate(resourceTemplate.id))
      .subscribe(
        () => {
          this.entityStatus = EntityFormStatus.SUCCESS;
          this.snackbar.success('Resource template', 'Deleted successfully');
        },
        (_) => {
          this.entityStatus = EntityFormStatus.ERROR;
        }
      );
  }

  fillForm() {
    if (this.selectedForEdit) {
      Object.keys(this.selectedForEdit.properties).forEach((key) => {
        const formItem = this.resourceTemplateForm.controls[key];
        if (formItem) {
          formItem.setValue(this.selectedForEdit.properties[key][0]);
        }
      });
    }
  }

  compareFn(item, selected) {
    return item.id === selected;
  }
}
