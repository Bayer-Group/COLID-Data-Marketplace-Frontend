import {
  Component,
  forwardRef,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormItemInputBaseComponent } from "../form-item-input-base/form-item-input-base.component";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { Metadata } from "src/app/shared/models/metadata/meta-data";
import { Entity } from "src/app/shared/models/entities/entity";
import { FormItemChangedDTO } from "src/app/shared/models/form/form-item-changed-dto";
import { FormChangedDTO } from "src/app/shared/models/form/form-changed-dto";
import { FormService } from "src/app/shared/services/form.service";
import { Constants } from "src/app/shared/constants";
import { Observable, of } from "rxjs";
import { PidUriTemplateResultDTO } from "src/app/shared/models/pidUriTemplates/pid-uri-template-result-dto";
import { MatDialog } from "@angular/material/dialog";
import { DeleteItemDialogComponent } from "src/app/shared/components/delete-item-dialog/delete-item-dialog.component";
import { MetaDataProperty } from "src/app/shared/models/metadata/meta-data-property";

@Component({
  selector: "app-form-item-input-nested",
  templateUrl: "./form-item-input-nested.component.html",
  styleUrls: ["./form-item-input-nested.component.css"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormItemInputNestedComponent),
      multi: true,
    },
  ],
})
export class FormItemInputNestedComponent extends FormItemInputBaseComponent {
  @Input() newNestedEntities: string[];
  @Input() errors: any;
  @Input() metaData: Metadata[];
  @Input() label: string;
  @Input() fetched: boolean;
  @Input() presets: Observable<Array<PidUriTemplateResultDTO>>;
  @Input() indexerNested: number;
  @Input() formReadOnly: boolean = false;

  nestedObjects: Entity[];
  nestedTypesVisible = false;
  selectedNestedType: Metadata = null;

  constants = Constants;
  @Output() removeFormItem: EventEmitter<any> = new EventEmitter<any>();

  get fetched$() {
    return of(this.fetched);
  }

  get nestedMetadata() {
    if (this.internalValue != null) {
      const metadata = this.metaData.find(
        (r) =>
          r.key ===
          this.internalValue.properties[Constants.Metadata.EntityType][0]
      );
      return metadata.properties;
    }
    return null;
  }

  constructor(private formService: FormService, public dialog: MatDialog) {
    super();
  }

  writeValue(value: Entity): void {
    if (value != null) {
      this.internalValue = value;
    }
  }

  confirmAndRemoveNested() {
    const dialogRef = this.dialog.open(DeleteItemDialogComponent, {
      data: {
        header: `Deleting ${this.label}`,
        body: `Are you sure you want to delete this ${this.label}?`,
      },
      width: "auto",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.removeFormItem.emit();
      }
    });
  }

  handleInputChange(event: FormItemChangedDTO) {
    this.handleValueChanged(event.value);

    this.valueChanged.emit(event);
  }

  handleValueChanged(publicValue: Entity) {
    this.onChange(publicValue);
    this.onTouched();
  }

  handleNestedFormChanged(event: FormChangedDTO) {
    const entity = this.createEntity(
      event.formValue,
      this.internalValue.id,
      this.nestedMetadata
    );
    const formItemChangedDTO = new FormItemChangedDTO(event.id, entity);
    this.handleInputChange(formItemChangedDTO);
  }

  createEntity(formValues, id, metaData: MetaDataProperty[]) {
    const formProperties = Object.entries(formValues);
    const entity = this.formService.createEntity(formProperties, metaData);
    entity.id = id;
    return entity;
  }

  get isNewEntity() {
    return this.internalValue == null
      ? false
      : this.newNestedEntities.includes(this.internalValue.id);
  }
}
