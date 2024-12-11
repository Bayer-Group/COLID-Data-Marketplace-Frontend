import { Injectable } from '@angular/core';
import { Entity } from 'src/app/shared/models/entities/entity';
import { FormExtension } from 'src/app/shared/extensions/form.extension';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  createEntity(formProperties, metadata): Entity {
    const newResource = new Entity();
    newResource.properties = FormExtension.createEntityPropertyList(
      formProperties,
      metadata
    );

    return newResource;
  }
}
