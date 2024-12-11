import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntityTypeDto } from 'src/app/shared/models/entities/entity-type-dto';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { ResourceTemplateResultDTO } from 'src/app/shared/models/resource-templates/resource-template-result-dto';
import {
  FetchResourceTypeHierarchy,
  MetadataState
} from 'src/app/states/metadata.state';

import {
  FetchResourceTemplateMetadata,
  FetchResourceTemplates,
  ResourceTemplateState
} from 'src/app/states/resource-template.state';

@Component({
  selector: 'app-resource-template',
  templateUrl: './resource-template.component.html',
  styleUrls: ['./resource-template.component.scss']
})
export class ResourceTemplateComponent implements OnInit {
  @Select(ResourceTemplateState.getResourceTemplatesMetadata)
  resourceTemplateMetadata$: Observable<Array<MetaDataProperty>>;

  @Select(ResourceTemplateState.getResourceTemplates)
  resourceTemplates$: Observable<Array<ResourceTemplateResultDTO>>;

  @Select(MetadataState.getResourceTypeHierarchy)
  resourceHierarchy$: Observable<EntityTypeDto>;

  resourceTemplateTableInput$: Observable<{
    resourceTemplates: Array<ResourceTemplateResultDTO>;
    metadata: Array<MetaDataProperty>;
    resourceTypes: Array<{ id: string; label: string }> | null;
  }>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch([
      new FetchResourceTemplates(),
      new FetchResourceTemplateMetadata(),
      new FetchResourceTypeHierarchy()
    ]);
    this.resourceTemplateTableInput$ = combineLatest([
      this.resourceTemplates$,
      this.resourceTemplateMetadata$,
      this.resourceHierarchy$
    ]).pipe(
      map(([resourceTemplates, metadata, resourceHierarchy]) => {
        if (resourceHierarchy) {
          const resourceTypes = this.getResourceTypes(resourceHierarchy);

          return {
            resourceTemplates,
            metadata,
            resourceTypes: resourceTypes
          };
        }

        return {
          resourceTemplates,
          metadata,
          resourceTypes: null
        };
      })
    );
  }

  reload() {
    this.store.dispatch(new FetchResourceTemplates());
  }

  private getResourceTypes(entity: EntityTypeDto) {
    const resourceTypes: Array<{ id: string; label: string }> = [];

    if (entity.instantiable) {
      resourceTypes.push({ id: entity.id, label: entity.label });
    }

    entity.subClasses.forEach((subEntity) =>
      resourceTypes.push(...this.getResourceTypes(subEntity))
    );

    return resourceTypes;
  }
}
