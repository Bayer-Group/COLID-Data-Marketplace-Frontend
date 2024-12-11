import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { Entity } from 'src/app/shared/models/entities/entity';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Constants } from 'src/app/shared/constants';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-entity-historic',
  templateUrl: './entity-historic.component.html',
  styleUrls: ['./entity-historic.component.css']
})
export class EntityHistoricComponent implements OnInit, OnDestroy {
  @Input() entities: Array<Entity>;
  @Input() header: string;
  @Input() subHeader: string;
  @Input() historicEntities: Map<string, Entity>;
  @Input() metadata:
    | Map<string, Array<MetaDataProperty>>
    | Array<MetaDataProperty>;
  @Input() isMetadataMapped: boolean = false;
  @Input() selectedEntity: Observable<string>;

  @Output() selectionChange: EventEmitter<Entity> = new EventEmitter<Entity>();
  @Output() versionClick: EventEmitter<any> = new EventEmitter<any>();

  selectedStep: number;
  constants = Constants;
  selectedEntitySubscription: Subscription;

  metadataRelease(entity: Entity): Array<MetaDataProperty> {
    if (this.isMetadataMapped) {
      const metadata = this.metadata as Map<string, Array<MetaDataProperty>>;
      const release =
        entity.properties[Constants.Metadata.MetadataReleaseConfig][0];
      return metadata.has(release) ? metadata.get(release) : [];
    }

    return this.metadata as Array<MetaDataProperty>;
  }

  ngOnInit() {
    this.selectedEntitySubscription = this.selectedEntity?.subscribe((id) => {
      if (id == null) {
        if (this.entities && this.entities.length !== 0) {
          this.selectionChange.emit(this.entities[this.entities.length - 1]);
        }
      } else {
        this.selectedStep = this.entities.findIndex(
          (entity) => entity.id === id
        );
      }
    });
  }

  ngOnDestroy() {
    this.selectedEntitySubscription?.unsubscribe();
  }

  getState(overview: any): string {
    return overview.lifeCycleStatus ===
      Constants.Resource.LifeCycleStatus.Published
      ? 'published'
      : 'history';
  }

  getHeader(entity: any): string {
    return entity[this.header];
  }

  getSubHeader(entity: any): string {
    return entity[this.subHeader];
  }

  handleSelectionChanged(event: StepperSelectionEvent) {
    this.selectionChange.emit(this.entities[event.selectedIndex]);
  }

  handleVersionClick($event) {
    this.versionClick.emit($event);
  }
}
