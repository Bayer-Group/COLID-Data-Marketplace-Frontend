import { Entity } from './entity';

export class EntityTypeDto extends Entity {
  label: string;
  description: string;
  instantiable: boolean;
  selectedResourceTypeTemplate: string;
  resourceTypeTemplates: { templateName: string; resourcePidUri: any }[];
  subClasses: Array<EntityTypeDto>;

  constructor() {
    super();
  }
}
