import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageViewerDialogComponent } from 'src/app/shared/components/image-viewer-dialog/image-viewer-dialog.component';
import { Constants } from 'src/app/shared/constants';
import { Entity } from 'src/app/shared/models/entities/entity';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';

@Component({
  selector: 'app-entity-display-image',
  templateUrl: './entity-display-image.component.html',
  styleUrls: ['./entity-display-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityDisplayImageComponent {
  @Input() group: string;
  @Input() groupedMetadata: Array<MetaDataProperty>;
  @Input() entity: Entity;

  constants = Constants;

  constructor(private dialog: MatDialog) {}

  onOpenImageDialog(index: number, entityProperty) {
    this.dialog.open(ImageViewerDialogComponent, {
      data: {
        index,
        images: entityProperty
      }
    });
  }

  onHoverOverImage(index: number, entityProperty: any) {
    return entityProperty[index]['properties'][Constants.Metadata.Comment];
  }

  get label(): string {
    const metadataProperty = this.groupedMetadata[0];
    const label: string = metadataProperty.properties[Constants.Metadata.Name];

    return label == null ? '' : label;
  }

  get amountImagesText(): string {
    const entityProperty =
      this.entity.properties[Constants.Metadata.HasAttachment];
    const amountOfImages = entityProperty.length;

    return `${amountOfImages} ${this.label.toLocaleLowerCase()}${
      amountOfImages > 1 ? 's' : ''
    }`;
  }
}
