import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Metadata } from 'src/app/shared/models/metadata/meta-data';
import { Entity } from 'src/app/shared/models/entities/entity';
import { Constants } from 'src/app/shared/constants';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-form-item-create-nested',
  templateUrl: './form-item-create-nested.component.html',
  styleUrls: ['./form-item-create-nested.component.scss']
})
export class FormItemCreateNestedComponent {
  @Input() disabled: boolean = false;
  @Input() label: string;
  @Input() metaData: Metadata[];

  @Output() createNestedEntity: EventEmitter<Entity> =
    new EventEmitter<Entity>();

  addNestedEntity() {
    const entity = new Entity();
    entity.id = Constants.Resource.Prefix + Guid.create();

    entity.properties[Constants.Metadata.EntityType] = [this.metaData[0].key];

    this.createNestedEntity.emit(entity);
  }
}
