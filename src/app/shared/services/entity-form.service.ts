import { Injectable } from '@angular/core';
import { FormExtension } from 'src/app/shared/extensions/form.extension';
import { Constants } from 'src/app/shared/constants';
import { EntityBase } from 'src/app/shared/models/entities/entity-base';

@Injectable({
  providedIn: 'root'
})
export class EntityFormService {
  createEntity(formProperties, metadata, type: string): EntityBase {
    const entity = new EntityBase();

    entity.properties = FormExtension.createEntityPropertyList(
      formProperties,
      metadata
    );

    entity.properties[Constants.Metadata.EntityType] = [type];

    return entity;
  }
}
