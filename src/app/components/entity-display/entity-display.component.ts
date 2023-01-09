import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { MetadataExtension } from 'src/app/shared/extensions/metadata.extension';
import { Constants } from 'src/app/shared/constants';
import { VersionProperty } from 'src/app/shared/models/resources/version-property';
import { Entity } from 'src/app/shared/models/entities/entity';

@Component({
  selector: "app-entity-display",
  templateUrl: "./entity-display.component.html",
  styleUrls: ["./entity-display.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityDisplayComponent implements OnInit {
  @Input() metadata: Array<MetaDataProperty>;
  @Input() entity: Entity;
  @Input() entityVersions: Array<VersionProperty>;

  constructor() {}

  ngOnInit(): void {}

  isVisibleMetadataGroup(key: string) {
    return !MetadataExtension.isInvisbleGroupKey(key);
  }

  isAttachmentGroup(key: string) {
    return key === Constants.Resource.Groups.Images;
  }
}
