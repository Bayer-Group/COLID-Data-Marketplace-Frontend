import { Component, OnInit, Input } from '@angular/core';
import { DetailsViewModel, DetailsViewModelNested } from '../search-result.component';
import { Constants } from 'src/app/shared/constants';
import { MatDialog } from '@angular/material/dialog';
import { ImageViewerDialogComponent } from 'src/app/shared/components/image-viewer-dialog/image-viewer-dialog.component';

@Component({
  selector: 'app-search-result-attachment',
  templateUrl: './search-result-attachment.component.html',
  styleUrls: ['./search-result-attachment.component.scss']
})
export class SearchResultAttachmentComponent implements OnInit {
  @Input() index: number;
  @Input() resource: DetailsViewModel[];
  @Input() attachment: DetailsViewModelNested[];
  @Input() allAttachments: any;

  constants = Constants;
  invisibleProperties : Array<string> = [Constants.Metadata.EntityType, Constants.Metadata.HasTargetUri, Constants.Metadata.HasNetworkedResourceLabel];

  sortedMetadataProperties: any;

  description: string;
  label: string;

  searchText: string;
  searchTimestamp: Date;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  GetMetadataKey(metadataProperty: any): any {
    return metadataProperty.properties[Constants.Metadata.HasPidUri];
  }

  IsVisibleProperty(metadataProperty: any): boolean {
    const key = this.GetMetadataKey(metadataProperty);

    if(this.invisibleProperties.includes(key)) {
      return false;
    }

    return true;
  }

  onOpenImageDialog(entityProperty: any) {
    this.dialog.open(ImageViewerDialogComponent, {
      data: {
        index: this.index,
        images: entityProperty
      }
    });
  }

  get mappedAttachments() {
    return this.allAttachments.map(a => {
      var comment = a.value.filter(v => v.key === this.constants.Metadata.Comment)[0].value;
      return {id: a.id, properties: { 'http://www.w3.org/2000/01/rdf-schema#comment': comment}};
    });
  }

  get comment() {
    let comment = this.attachment['value'].filter(v => v.key === this.constants.Metadata.Comment)[0];
    return comment.value;
  }
}
