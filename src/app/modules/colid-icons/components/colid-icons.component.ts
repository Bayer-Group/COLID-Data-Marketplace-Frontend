import { Component, Input } from '@angular/core';
import { IconMapping } from '../models/icon-mapping';
import { ColidIconsService } from '../services/colid-icons.service';
import { IconTypes } from '../models/icon-types';

// TODO: Unify - duplicate code with colid-ui-editor-frontend

@Component({
  selector: 'ds-icon',
  templateUrl: './colid-icons.component.html',
  styles: [
    '::ng-deep mat-icon svg { pointer-events: none; }',
    '.mat-icon { color: black }'
  ]
})
export class ColidIconsComponent {
  @Input() icon: string;
  @Input() delay: number;
  @Input() tooltip: string;
  @Input() tooltipDisabled: boolean = true;
  @Input() iconType: IconTypes = IconTypes.Default;

  iconTypes = IconTypes;

  iconsRegistered = false;

  get encodedIcon(): string {
    return this.appIconService.encodeString(this.icon);
  }

  constructor(private appIconService: ColidIconsService) {
    appIconService.iconsRegistered$.subscribe(
      (res) => (this.iconsRegistered = res)
    );
  }

  get iconKey(): string {
    if (this.icon) {
      if (this.iconType === this.iconTypes.Mapping) {
        return IconMapping[this.icon].icon;
      } else if (this.iconType === this.iconTypes.S3) {
        return this.encodedIcon;
      } else {
        return this.icon;
      }
    }
  }

  get label(): string {
    if (this.iconType === this.iconTypes.Mapping) {
      return IconMapping[this.icon].tooltip;
    } else if (this.iconType === this.iconTypes.S3) {
      return this.appIconService._tooltipMapping.get(this.iconKey);
    } else {
      return this.tooltip;
    }
  }
}
