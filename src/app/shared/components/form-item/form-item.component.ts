import {
  Component,
  OnInit,
  forwardRef,
  Input,
  EventEmitter,
  Output,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FormItemSettings } from "src/app/shared/models/form/form-item-settings";
import { MetaDataProperty } from "src/app/shared/models/metadata/meta-data-property";
import { FormItemChangedDTO } from "src/app/shared/models/form/form-item-changed-dto";
import {
  FieldTypeMapping,
  MetaDataPropertyIdentifier,
} from "../../resource-form.constants";
import { Observable, of } from "rxjs";
import { PidUriTemplateResultDTO } from "src/app/shared/models/pidUriTemplates/pid-uri-template-result-dto";
import { MetaDataPropertyGroup } from "src/app/shared/models/metadata/meta-data-property-group";
import { MultiselectSettings } from "../../models/form/multi-select-settings";
import { Constants } from "src/app/shared/constants";
import { FieldTypeFormItemMapping } from "./form-item.constants";
import { AttachmentUploadedDto } from "src/app/shared/models/attachment/attachment-uploaded-dto";

@Component({
  selector: "app-form-item",
  templateUrl: "./form-item.component.html",
  styleUrls: ["./form-item.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormItemComponent),
      multi: true,
    },
  ],
})
export class FormItemComponent implements OnInit, ControlValueAccessor {
  internalValue: any = null;
  multiselectSettings: MultiselectSettings;
  readonly = false;
  type: string;
  multiple = false;
  constants = Constants;

  @Input() name: string;
  @Input() metaData: MetaDataProperty;
  @Input() errors: any;
  @Input() fetched: boolean;
  @Input() formReadOnly: boolean = false;
  @Input() isNew: boolean;

  get fetched$(): Observable<boolean> {
    return of(this.fetched);
  }

  @Input() presets: Observable<Array<PidUriTemplateResultDTO>>;
  @Input() adminPrivilege: boolean;
  @Input() formItemSettings: FormItemSettings;
  @Input() newNestedEntities: string[];
  @Input() indexerNested: number;
  @Input() mainDistribution: boolean;

  @Input() readOnly: boolean;
  // set readOnly(value: boolean) {
  //   if(this.setReadOnly===undefined){
  //     return;
  //   }
  //   this.setReadOnly(value);
  // }

  @Output() removeFormItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() mainDistributionChanged: EventEmitter<any> =
    new EventEmitter<any>();
  @Output() attachmentUploaded: EventEmitter<AttachmentUploadedDto> =
    new EventEmitter<AttachmentUploadedDto>();
  @Output() valueChanged: EventEmitter<FormItemChangedDTO> =
    new EventEmitter<FormItemChangedDTO>();

  @Input() controlSize: string;
  onChange: any = () => {};
  onTouched: any = () => {};

  created: boolean = true;

  constructor() {}

  ngOnInit() {
    this.multiselectSettings = {
      multiple: !this.singleSelection,
      maxSelectedItems: this.limitSelection,
      disabled: this.readonly,
      addTag: this.fieldType === "extendableList",
      hideSelected: true,
    };
    this.setReadOnly(this.readOnly);
  }

  get limitSelection() {
    if (
      this.metaData.properties[Constants.Metadata.HasPidUri] ===
      Constants.Metadata.EntityType
    ) {
      return "1";
    }
    return this.metaData.properties[Constants.Metadata.MaxCount] === "1"
      ? null
      : this.metaData.properties[Constants.Metadata.MaxCount];
  }

  get singleSelection() {
    if (
      this.metaData.properties[Constants.Metadata.HasPidUri] ===
      Constants.Metadata.EntityType
    ) {
      return true;
    }
    return this.metaData.properties[Constants.Metadata.MaxCount] === "1";
  }

  async setReadOnly(readOnly: boolean) {
    if (this.metaData === undefined) {
      return;
    }
    if (this.metaData.key === Constants.Metadata.EntityType) {
      this.readonly = true;
      return;
    }
    if (
      this.metaData.key === Constants.Metadata.HasConsumerGroup &&
      this.adminPrivilege &&
      !this.isNew
    ) {
      this.readonly = false;
      return;
    }
    if (
      this.metaData.properties[Constants.Metadata.Group] != null &&
      this.metaData.properties[Constants.Metadata.Group].key ==
        Constants.Resource.Groups.TechnicalInformation
    ) {
      this.readonly = true;
      return;
    }

    if (this.fieldType === "nested") {
      this.readonly = false;
      return;
    }

    if (readOnly != null) {
      this.readonly = readOnly;
    }
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  handleInputValueChanged(event: FormItemChangedDTO) {
    this.onChange(this.internalValue);
    this.onTouched();
    event.created = this.created;
    this.valueChanged.emit(event);
    this.created = false;
  }

  handleAttachmentUploaded(event: AttachmentUploadedDto) {
    this.attachmentUploaded.emit(event);
  }

  writeValue(value: any): void {
    if (value != null) {
      this.internalValue = this.prepareInternalValue(value);
    }
  }

  handleRemoveFormItem() {
    this.removeFormItem.emit();
  }

  handleMainDistributionChanged() {
    this.mainDistributionChanged.emit();
  }

  get fieldType() {
    const fieldType = this.metaData.properties[Constants.Metadata.FieldType];

    if (fieldType == null) {
      return this.fieldTypeByShaclDeepCheck;
    }
    return FieldTypeFormItemMapping[fieldType];
  }

  get fieldTypeByShaclDeepCheck() {
    let fieldType =
      FieldTypeMapping[this.metaData.properties[Constants.Metadata.Datatype]];

    const metadataKey = this.metaData.properties[Constants.Metadata.HasPidUri];
    const range = this.metaData.properties[Constants.Metadata.Range];

    if (
      metadataKey === MetaDataPropertyIdentifier.pidUri ||
      metadataKey === MetaDataPropertyIdentifier.baseUri
    ) {
      return "identifier";
    }

    if (range === Constants.Person.Type) {
      return "person";
    }

    if (
      this.metaData.properties[Constants.Metadata.Pattern] ===
      Constants.Regex.NaturalNumber
    ) {
      fieldType = "number";
    }

    if (
      this.metaData.properties[Constants.Metadata.MaxCount] == null ||
      (this.metaData.properties[Constants.Metadata.MaxCount] != null &&
        this.metaData.properties[Constants.Metadata.MaxCount] > 1)
    ) {
      fieldType = "general-multi";
    }

    if (
      this.metaData.properties[Constants.Metadata.NodeKind] ===
        Constants.Metadata.NodeType.IRI &&
      range
    ) {
      fieldType = "list";
    }

    if (
      this.metaData.key == Constants.Metadata.HasAttachment &&
      this.metaData.nestedMetadata.length !== 0
    ) {
      fieldType = "attachment";
    }

    if (
      this.metaData.key == Constants.Metadata.Distribution &&
      this.metaData.nestedMetadata.length !== 0
    ) {
      fieldType = "distribution";
    }

    const group: MetaDataPropertyGroup =
      this.metaData.properties[Constants.Metadata.Group];
    if (group != null && group.key === Constants.Resource.Groups.LinkTypes) {
      fieldType = "linking";
    }

    if (fieldType === "taxonomy" || fieldType === "list") {
      this.internalValue =
        Array.isArray(this.internalValue) || this.internalValue == null
          ? this.internalValue
          : [this.internalValue];
    }

    return fieldType;
  }

  prepareInternalValue(value: any) {
    if (this.singleSelection && Array.isArray(value)) {
      return value.length !== 0 ? value[0] : null;
    }

    return value;
  }
}
