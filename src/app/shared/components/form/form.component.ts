import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormArray,
  AbstractControl
} from '@angular/forms';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { MetaDataPropertyIdentifier } from 'src/app/shared/resource-form.constants';
import { FormItemSettings } from 'src/app/shared/models/form/form-item-settings';
import { Observable } from 'rxjs';
import {
  ValidationResultProperty,
  ValidationResultPropertyType
} from 'src/app/shared/models/validation/validation-result-property';
import { Entity } from 'src/app/shared/models/entities/entity';
import { FormChangedDTO } from 'src/app/shared/models/form/form-changed-dto';
import { FormItemChangedDTO } from 'src/app/shared/models/form/form-item-changed-dto';
import { PidUriTemplateResultDTO } from 'src/app/shared/models/pidUriTemplates/pid-uri-template-result-dto';
import { StringExtension } from 'src/app/shared/extensions/string.extension';
import { MetaDataPropertyGroup } from 'src/app/shared/models/metadata/meta-data-property-group';
import { Constants } from 'src/app/shared/constants';
import { Store } from '@ngxs/store';
import { SetMainDistribution } from 'src/app/states/resource.state';
import { MetadataExtension } from 'src/app/shared/extensions/metadata.extension';
import { ResourceCreationType as EntityCreationType } from 'src/app/shared/models/resources/resource-creation-type';
import { Resource } from 'src/app/shared/models/resources/resource';
import { LinkingMapping } from 'src/app/shared/models/resources/linking-mapping';

// TODO: Unify - duplicate code with colid-ui-editor-frontend

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  @Output() handleFormChanged = new EventEmitter<FormChangedDTO>();

  @Input() adminPrivilege: boolean;
  @Input() readOnly: boolean;
  @Input() nestedForm: boolean;
  @Input() pidUriTemplatesFetched: Observable<boolean>;
  @Input() pidUriTemplateNames: Observable<Array<PidUriTemplateResultDTO>>;
  @Input() placeholder: any;
  @Input() isNew: boolean;
  @Input() isTypeChanging: boolean = false;
  @Input() formReadOnly: boolean;
  @Input() hasPublishedVersion: boolean;
  @Input() creationType: EntityCreationType = EntityCreationType.NEW;

  @Input() mainDistribution: string;

  @Input() indexerNested: number;

  get indexerNested_() {
    return this.indexerNested == null ? '' : this.indexerNested;
  }
  _resource: Resource;

  @Input()
  set entity(entity: Resource) {
    if (entity != null) {
      this._entity = entity;
      this._resource = entity;
      if (entity.links != null) {
        this._links = entity.links;
      }
      this._entity = new Entity();
      this._entity.id = entity.id;
      this._entity.properties = entity.properties;
    }
    if (this.ontologyForm != null) {
      this.fillForm();
    }
    this.buildForm(); //building the form again due to distribution spinner issue
  }
  _entity: Entity;
  _links: Map<string, LinkingMapping[]>;

  @Input() linkingMetadata: MetaDataProperty[];

  @Input()
  set metaData(metaData: MetaDataProperty[]) {
    if (metaData != null) {
      this._metaData = metaData;
      this.linkingGroupFirstIndex = this._metaData.findIndex((m) =>
        this.isLinkingGroup(m)
      );
      this.addInboundLinkTypes();
      this.buildForm();
    }
  }

  _metaData: MetaDataProperty[];

  @Input()
  set errors(errors: ValidationResultProperty[]) {
    this.removeDuplicateValidationErrors();

    if (errors != null) {
      this.showValidationResult(errors, this._entity.id);
    }
  }

  constants = Constants;
  pidUriConstant = Constants.Metadata.HasPidUri;
  distributionConstant = Constants.Metadata.Distribution;
  attachmentConstant = Constants.Metadata.HasAttachment;

  ontologyForm: UntypedFormGroup = null;

  newNestedEntities = new Array<string>();
  formItemSettings: FormItemSettings = {
    debounceTime: 500
  };

  linkingGroupFirstIndex: number;

  get f(): { [p: string]: AbstractControl } {
    return this.ontologyForm.controls;
  }

  addInboundLinkTypes() {
    if (
      !(this._links == undefined || this._links == null) &&
      this._metaData.length != 0 &&
      !this.isNew
    ) {
      let allResourceLinks = Object.keys(this._links);
      let linkMetadata = this.linkingMetadata.map((x) => x.key);
      let inboundLinkMetadata = allResourceLinks.filter(
        (x) => !linkMetadata.some((y) => y == x)
      );

      var lastLinkString = linkMetadata.pop();
      var lastLink = this._metaData.find((x) => x.key == lastLinkString);

      inboundLinkMetadata.forEach((x) => {
        let metadataproperty = new MetaDataProperty();
        metadataproperty.key = x;
        let propertylist = new Map<string, any>();
        propertylist[Constants.Metadata.Group.toString()] =
          new MetaDataPropertyGroup(
            Constants.Resource.Groups.LinkTypes.toString(),
            'Linked Resources',
            900,
            'A group for all link types between resources',
            'Grouping all link types'
          );
        propertylist[Constants.Metadata.HasPidUri] = x;
        propertylist[Constants.Metadata.Comment] =
          this._links[x][0]['inboundLinkComment'];
        propertylist[Constants.Metadata.Name] =
          this._links[x][0]['inboundLinkLabel'];
        metadataproperty.properties = propertylist;
        metadataproperty.nestedMetadata = [];
        var metadataproperty_object = JSON.parse(
          JSON.stringify(metadataproperty)
        );
        this._metaData.splice(
          this._metaData.indexOf(lastLink),
          0,
          metadataproperty_object
        );
      });
    }
  }

  links(m: MetaDataProperty) {
    var link = new Map<string, LinkingMapping>(Object.entries(this._links)).get(
      m.key
    );

    return link;
  }

  get setShaclDefaultValues() {
    return this.isNew && this.creationType === EntityCreationType.NEW;
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private store: Store
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    if (this._entity && this._metaData) {
      const formBuilderGroup = {};
      for (const m of this._metaData) {
        if (
          m.properties[Constants.Metadata.Group]['key'] ==
          Constants.Resource.Groups.LinkTypes
        ) {
          continue;
        }
        if (m.nestedMetadata.length !== 0) {
          formBuilderGroup[m.properties[this.pidUriConstant]] =
            new UntypedFormArray([]);
        } else {
          const customPlaceholder =
            this.placeholder[m.properties[this.pidUriConstant]];
          const shaclPlaceholder = m.properties[Constants.Shacl.DefaultValue];
          const placeholder =
            customPlaceholder == null && this.setShaclDefaultValues
              ? shaclPlaceholder
              : customPlaceholder;
          formBuilderGroup[m.properties[this.pidUriConstant]] =
            this.formBuilder.control(placeholder);
        }
      }
      this.ontologyForm = this.formBuilder.group(formBuilderGroup);

      this.fillForm();
    }
  }

  isIgnoredProperty(m: MetaDataProperty) {
    return (
      MetadataExtension.isIgnoredProperty(m) ||
      m.key === Constants.Metadata.MainDistribution
    );
  }

  fillForm() {
    if (this._entity && this._entity.properties) {
      Object.keys(this._entity.properties).forEach((key) => {
        const formItem = this.ontologyForm.controls[key];
        const value = this._entity.properties[key];
        if (formItem && formItem instanceof UntypedFormControl) {
          formItem.setValue(value);
        }

        if (formItem && formItem instanceof UntypedFormArray) {
          if (Array.isArray(value)) {
            formItem.controls.splice(0, formItem.controls.length);
            value.forEach((entity) => {
              formItem.push(this.formBuilder.control(entity));
              if (this.isNew) {
                this.newNestedEntities.push(entity.id);
              }
            });
          }
        }
      });

      if (!this.nestedForm) {
        this.handleFormChanged.emit(
          new FormChangedDTO(null, null, this.ontologyForm.value, true, true)
        );
      }
    }
  }

  handleCreateNestedEntity(formControlKey: string, entity: Entity) {
    const formItem = this.ontologyForm.controls[formControlKey];
    if (formItem && formItem instanceof UntypedFormArray) {
      formItem.push(this.formBuilder.control(entity));
      this.newNestedEntities.push(entity.id);
      this.handleFormChanged.emit(
        new FormChangedDTO(
          formControlKey,
          entity,
          this.ontologyForm.value,
          true
        )
      );
    }
  }

  handleRemoveFormItem(formControlKey: string, index: number) {
    const formArray = this.ontologyForm.controls[formControlKey];
    if (formArray && formArray instanceof UntypedFormArray) {
      formArray.removeAt(index);
    }
    this.handleFormChanged.emit(
      new FormChangedDTO(formControlKey, null, this.ontologyForm.value, true)
    );
  }

  handleMainDistributionChanged(control: UntypedFormControl) {
    this.store.dispatch(new SetMainDistribution(control.value.id)).subscribe();
  }

  handleAttachmentUploaded(_) {
    this.handleFormChanged.emit(
      new FormChangedDTO(
        this.constants.Metadata.HasAttachment,
        null,
        this.ontologyForm.value,
        true
      )
    );
  }

  isFormItemReadOnly(metadata: MetaDataProperty): boolean {
    if (this.readOnly == true) {
      return true;
    }

    const metadataKey = metadata.properties[this.pidUriConstant];
    if (this.adminPrivilege) {
      if (metadataKey === Constants.Metadata.HasConsumerGroup) {
        return false;
      }
    }

    if (
      metadataKey === MetaDataPropertyIdentifier.pidUri ||
      metadataKey === MetaDataPropertyIdentifier.baseUri
    ) {
      return !this.isNew && !this.isTypeChanging;
    }

    if (metadataKey === Constants.Metadata.EntityType) {
      return true;
    }

    return false;
  }

  handleResourceFormItemChange(event: FormItemChangedDTO) {
    this.handleFormChanged.emit(
      new FormChangedDTO(
        event.id,
        event.value,
        this.ontologyForm.value,
        true,
        false,
        event.created
      )
    );
  }

  removeDuplicateValidationErrors() {
    if (this.ontologyForm == null) {
      return;
    }

    Object.keys(this.ontologyForm.controls).forEach((key) => {
      const formArray = this.ontologyForm.controls[key];
      const error: ValidationResultProperty = formArray.getError('result');
      if (
        error != null &&
        error.type === ValidationResultPropertyType.DUPLICATE
      ) {
        formArray.setErrors(null);
      }

      if (formArray instanceof UntypedFormArray) {
        Object.keys(formArray.controls).forEach((key2) => {
          const formItem = formArray.controls[key2];
          const formItemError: ValidationResultProperty =
            formItem.getError('result');
          if (Array.isArray(formItemError)) {
            formItem.setErrors({
              incorrect: false,
              result: formItemError.filter(
                (t) => t.type !== ValidationResultPropertyType.DUPLICATE
              )
            });
          }
        });
      }
    });
  }

  showValidationResult(results: ValidationResultProperty[], id: string) {
    results.forEach((result) => {
      if (
        result.node == null ||
        StringExtension.ExtractGuid(result.node) ===
          StringExtension.ExtractGuid(id)
      ) {
        const control = this.ontologyForm.controls[result.path];
        if (control) {
          control.setErrors({ incorrect: true, result: result });
        }
      } else {
        Object.keys(this.ontologyForm.controls).forEach((key) => {
          const formArray = this.ontologyForm.controls[key];
          if (formArray instanceof UntypedFormArray) {
            Object.keys(formArray.controls).forEach((key2) => {
              const formItem: UntypedFormArray = formArray.controls[key2];
              if (
                formItem.value != null &&
                formItem.value.id != null &&
                formItem.value.id === result.node
              ) {
                setTimeout(() => {
                  formItem.setErrors({ incorrect: false, result: [result] });
                  formItem.markAsDirty();
                });
              }
            });
          }
        });
      }
    });
  }

  isLinkingGroup(metadata: MetaDataProperty) {
    const group: MetaDataPropertyGroup =
      metadata.properties[Constants.Metadata.Group];
    return group != null && group.key === Constants.Resource.Groups.LinkTypes;
  }
}
