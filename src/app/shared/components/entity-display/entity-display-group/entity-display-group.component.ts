import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Constants } from 'src/app/shared/constants';
import { MetadataExtension } from 'src/app/shared/extensions/metadata.extension';
import { Entity } from 'src/app/shared/models/entities/entity';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { MetaDataPropertyGroup } from 'src/app/shared/models/metadata/meta-data-property-group';

@Component({
  selector: 'app-entity-display-group',
  templateUrl: './entity-display-group.component.html',
  styleUrls: ['./entity-display-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityDisplayGroupComponent {
  @Input() group: string;
  @Input() groupedMetadata: Array<MetaDataProperty>;
  @Input() entity: Entity;
  @Input() entityVersions: any;

  get isDistribution(): boolean {
    return this.group === Constants.Resource.Groups.DistributionEndpoints;
  }

  label(metadataProperty: MetaDataProperty): string {
    return metadataProperty.properties[Constants.Metadata.Name];
  }

  get groupLabel(): string {
    const metadataProperty = this.groupedMetadata[0];
    const group: MetaDataPropertyGroup =
      metadataProperty.properties[Constants.Metadata.Group];
    return group == null ? '' : group.label;
  }

  showLabel(metaDataProperty: MetaDataProperty): boolean {
    if (MetadataExtension.isIgnoredProperty(metaDataProperty)) {
      return false;
    }
    return true;
  }

  get hasSomeGroupValue(): boolean {
    return this.groupedMetadata.some((g) => this.propertyIsFilled(g.key));
  }

  propertyIsFilled(key: string) {
    return (
      this.entity.properties[key] != null &&
      this.entity.properties[key].length !== 0
    );
  }

  get mainDistributionPIDUri() {
    return Constants.Metadata.MainDistribution;
  }
}
