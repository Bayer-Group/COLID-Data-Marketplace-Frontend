import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Constants } from 'src/app/shared/constants';
import { StringExtension } from 'src/app/shared/extensions/string.extension';
import { LinkedResourceDisplayDialogComponent } from '../linked-resource-dialog/linked-resource-display-dialog.component';

@Component({
  selector: 'app-resource-item-tile',
  templateUrl: './resource-item-tile.component.html',
  styleUrls: ['./resource-item-tile.component.scss']
})
export class ResourceItemTileComponent {
  @Input() pidUri: string;
  @Input() resourceType: string;
  @Input() label: string;
  @Input() resourceDefinition: string;
  @Input() lifeCycleStatus: string;
  @Input() resourceLinkedLifecycleStatus: string | null;

  get strippedDefinition(): string {
    return StringExtension.ReplaceHtmlToText(this.resourceDefinition);
  }

  constructor(private dialog: MatDialog) {}

  openResourceDetailsDialog() {
    this.dialog.open(LinkedResourceDisplayDialogComponent, {
      data: {
        id: this.pidUri,
        confirmReview: false,
        isDraftResource:
          this.lifeCycleStatus === Constants.Resource.LifeCycleStatus.Draft
      },
      width: '80vw',
      autoFocus: false
    });
  }
}
