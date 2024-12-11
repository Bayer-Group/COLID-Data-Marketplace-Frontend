import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Metadata } from 'src/app/shared/models/metadata/meta-data';
import { Entity } from 'src/app/shared/models/entities/entity';
import { Constants } from 'src/app/shared/constants';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-form-item-create-attachment',
  templateUrl: './form-item-create-attachment.component.html',
  styleUrls: ['./form-item-create-attachment.component.scss']
})
export class FormItemCreateAttachmentComponent {
  @Input() disabled: boolean = false;
  @Input() label: string;
  @Input() metaData: Metadata[];

  @Output() createAttachment: EventEmitter<Entity> = new EventEmitter<Entity>();

  addAttachment() {
    const entity = new Entity();
    entity.id = Constants.Resource.Prefix + Guid.create();

    entity.properties[Constants.Metadata.EntityType] = [
      Constants.Attachment.Type
    ];

    this.createAttachment.emit(entity);
  }
}
