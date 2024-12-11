import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormItemInputBaseComponent } from '../form-item-input-base/form-item-input-base.component';
import { Constants } from 'src/app/shared/constants';
import { Observable } from 'rxjs';
import { PidUriTemplateResultDTO } from 'src/app/shared/models/pidUriTemplates/pid-uri-template-result-dto';
import { Entity } from 'src/app/shared/models/entities/entity';

// TODO: Unify - duplicate code with colid-ui-editor-frontend

@Component({
  selector: 'app-form-item-input-pid-uri',
  templateUrl: './form-item-input-pid-uri.component.html',
  styleUrls: ['./form-item-input-pid-uri.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormItemInputPidUriComponent),
      multi: true
    }
  ]
})
export class FormItemInputPidUriComponent
  extends FormItemInputBaseComponent
  implements OnInit
{
  @Input() debounceTime: number;

  prefix = Constants.PidUriTemplate.BaseUrl;

  externalSelected: boolean = false;
  selectedPreset: string = null;

  internalValue: string = null;

  @Input() externalUriAllowed: boolean;
  @Input() fetched: boolean;
  @Input() presets: Observable<Array<PidUriTemplateResultDTO>>;

  entity: Entity;

  get publicValue() {
    const trimmedInternalValue = this.internalValue
      ? this.internalValue.trim()
      : null;

    if (trimmedInternalValue) {
      if (this.externalSelected) {
        return trimmedInternalValue;
      } else {
        return this.prefix + trimmedInternalValue;
      }
    }

    return null;
  }

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.entity == null) {
      this.entity = new Entity();
    }
  }

  writeValue(value: Entity): void {
    if (value) {
      this.entity = <Entity>(Array.isArray(value) ? value[0] : value);
      if (this.entity != null) {
        if (this.entity.id != null) {
          this.internalValue = this.entity.id.replace(this.prefix, '');
          this.setExternalSelected();
        }
        this.setSelectedPreset();
        this.handleInputValueChanged(false);
      }
    }
  }

  setExternalSelected() {
    this.externalSelected = !this.entity.id.includes(this.prefix);
  }

  setSelectedPreset() {
    const property = this.entity.properties[Constants.Metadata.HasUriTemplate];
    this.selectedPreset = !property ? null : <string>property[0];
  }

  handleInputValueChanged(userInputTextChanged: boolean) {
    if (userInputTextChanged) {
      this.selectedPreset = null;
      if (this.entity.properties[Constants.Metadata.HasUriTemplate]) {
        delete this.entity.properties[Constants.Metadata.HasUriTemplate];
      }
    }

    if (this.publicValue == null && this.selectedPreset == null) {
      this.handleValueChanged(null);
      return;
    }

    if (this.entity == null) {
      this.entity = new Entity();
    }

    this.entity.properties[Constants.Metadata.EntityType] = [
      Constants.Identifier.Type
    ];

    this.entity.id = this.publicValue;

    if (this.selectedPreset != null) {
      this.entity.properties[Constants.Metadata.HasUriTemplate] = [
        this.selectedPreset
      ];
    }

    this.entity.properties[Constants.Metadata.EntityType] = [
      Constants.Identifier.Type
    ];

    this.handleValueChanged(
      Array.isArray(this.entity) ? this.entity : [this.entity]
    );
  }

  get isPresetSelected() {
    return this.selectedPreset != null;
  }

  getSelectedPresetName(
    pidUriTemplateResultDTOs: Array<PidUriTemplateResultDTO>
  ) {
    const template = pidUriTemplateResultDTOs.find(
      (t) => t.id === this.selectedPreset
    );
    return template != null ? template.name : null;
  }

  setPreset(preset: PidUriTemplateResultDTO) {
    this.internalValue = null;
    this.selectedPreset = preset.id;
    this.externalSelected = false;
    this.handleInputValueChanged(false);
  }

  setCustom() {
    this.selectedPreset = null;
    this.externalSelected = false;
    this.handleInputValueChanged(false);
  }

  setExternal() {
    this.selectedPreset = null;
    this.externalSelected = true;
    this.handleInputValueChanged(false);
  }
}
