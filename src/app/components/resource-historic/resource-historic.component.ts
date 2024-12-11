import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { combineLatest, Observable } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';
import { ResourceApiService } from 'src/app/core/http/resource.api.service';
import { Constants } from 'src/app/shared/constants';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { HistoryEntity } from 'src/app/shared/models/resources/history-entity';
import { VersionProperty } from 'src/app/shared/models/resources/version-property';
import {
  FetchEntityMetadata,
  MetadataState
} from 'src/app/states/metadata.state';

@Component({
  selector: 'app-resource-historic',
  templateUrl: './resource-historic.component.html',
  styleUrls: ['./resource-historic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourceHistoricComponent implements OnInit {
  @Input() pidUri: string;
  @Input() entityType: string;
  @Select(MetadataState.getEntityMetadata) entityMetadata$: Observable<
    Map<string, Array<MetaDataProperty>>
  >;
  historieEntities$: Observable<HistoryEntity[]>;

  constructor(
    private resourceService: ResourceApiService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.historieEntities$ = this.store
      .dispatch(new FetchEntityMetadata(this.entityType))
      .pipe(
        concatMap((_) => {
          return combineLatest([
            this.resourceService.getResourceRevisionHistory(this.pidUri),
            this.entityMetadata$
          ]).pipe(
            map(([historieEntities, metadata]) => {
              let values = metadata.get(this.entityType);
              return historieEntities.map((entity) => {
                const additionsEntityProps = Object.keys(entity.additionals);
                const removalEntityProps = Object.keys(entity.removals);
                const historyEntity: HistoryEntity = {
                  additions: {
                    entity: this.getPropertyAdditional(entity),
                    entityVersion: this.getAdditionalsVersion(entity),
                    metadata: values.filter(
                      (metadata) =>
                        additionsEntityProps.indexOf(metadata.key) > -1
                    )
                  },
                  removals: {
                    entity: this.getPropertyRemoval(entity),
                    entityVersion: this.getRemovalVersion(entity),
                    metadata: values.filter(
                      (x) => removalEntityProps.indexOf(x.key) > -1
                    )
                  },
                  lastChangedByDateTime: this.getLastChangeDateTime(entity),
                  lastChangeUser: ''
                };
                return historyEntity;
              });
            }),
            tap((historieEntities) => this.sortHistory(historieEntities)),
            tap((historieEntities) =>
              historieEntities.forEach(
                (entity, index) =>
                  (entity.lastChangeUser = this.getLastChangeUser(
                    historieEntities,
                    entity,
                    index
                  ))
              )
            )
          );
        })
      );
  }

  getPropertyAdditional(entity) {
    const additionals = {
      properties: JSON.parse(JSON.stringify(entity.additionals))
    };
    return additionals;
  }

  getPropertyRemoval(entity) {
    const removals = {
      properties: JSON.parse(JSON.stringify(entity.removals))
    };
    return removals;
  }

  getAdditionalsVersion(entity) {
    if (entity.additionals[Constants.Metadata.HasVersion]) {
      const uri = entity.additionals[Constants.Metadata.HasPidUri];
      let version: VersionProperty = {
        version: entity.additionals[Constants.Metadata.HasVersion][0],
        id: entity.name,
        pidUri: uri ? uri[0] : null,
        baseUri: null
      };

      return [version];
    }

    return [];
  }

  getRemovalVersion(entity) {
    if (entity.removals[Constants.Metadata.HasVersion]) {
      const uri = entity.removals[Constants.Metadata.HasPidUri];
      let version: VersionProperty = {
        version: entity.removals[Constants.Metadata.HasVersion][0],
        id: entity.name,
        pidUri: uri ? uri[0].id : null,
        baseUri: null
      };
      return [version];
    }

    return [];
  }

  getLastChangeDateTime(entity) {
    return entity.additionals[Constants.Metadata.LastChangeDateTime]
      ? entity.additionals[Constants.Metadata.LastChangeDateTime][0]
      : entity.additionals[Constants.Metadata.LastReviewDateTime][0];
  }

  isEmptyObject(obj) {
    return obj && Object.keys(obj).length === 0;
  }

  sortHistory(unsortedHistory: HistoryEntity[]) {
    unsortedHistory.sort((a, b) => {
      const dateA: number = new Date(a.lastChangedByDateTime).getTime();
      const dateB: number = new Date(b.lastChangedByDateTime).getTime();
      return dateB - dateA;
    });
  }

  getLastChangeUser(
    entities: HistoryEntity[],
    entity: HistoryEntity,
    index: number
  ): string {
    if (
      entity.additions.entity.properties[Constants.Metadata.HasLastChangeUser]
    ) {
      return entity.additions.entity.properties[
        Constants.Metadata.HasLastChangeUser
      ][0];
    } else if (
      entity.additions.entity.properties[Constants.Metadata.HasLastReviewer]
    ) {
      return entity.additions.entity.properties[
        Constants.Metadata.HasLastReviewer
      ][0];
    } else {
      let i = index + 1;
      return this.getPreLastchangeUser(entities, i);
    }
  }

  getPreLastchangeUser(entities: HistoryEntity[], startIndex: number) {
    for (let index = startIndex; index < entities.length; index++) {
      if (
        entities[index]['additions']['entity']['properties'][
          Constants.Metadata.HasLastChangeUser
        ]
      ) {
        return entities[index]['additions']['entity']['properties'][
          Constants.Metadata.HasLastChangeUser
        ][0];
      }
    }
  }
}
