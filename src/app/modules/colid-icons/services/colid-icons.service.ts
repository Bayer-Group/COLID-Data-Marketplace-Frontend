import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CustomMaterialIcon } from '../models/custom-material-icon';
import { BehaviorSubject } from 'rxjs';

declare const InstallTrigger: any;

@Injectable({
  providedIn: 'root'
})
export class ColidIconsService {

  public _tooltipMapping = new Map<string, string>();

  public iconsRegistered$ = new BehaviorSubject<boolean>(false);

  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) { }


  registerSvgIcons(icons: CustomMaterialIcon[]) {
    this.iconsRegistered$.next(false);
    icons.forEach(icon => {
      this.registerSvgIcon(icon);
    })
    this.iconsRegistered$.next(true);
  }

  registerSvgIcon(icon: CustomMaterialIcon) {
    if (!this._tooltipMapping.has(icon.key)){
      this.iconRegistry.addSvgIcon(
        icon.key,
        this.sanitizer.bypassSecurityTrustResourceUrl(icon.url)
      );

      this._tooltipMapping.set(icon.key, icon.tooltip);
    }
  }

  registerToolTip(key: string, tooltip: string) {
    this._tooltipMapping.set(key, tooltip);
  }

  registerColidIcons(icons: CustomMaterialIcon[]) {
    icons = icons.map(icon => {
      const key = this.encodeString(icon.key);
      icon.url = this.getEncodedS3Url(icon.key);
      icon.key = key;
      return icon;
    });

    this.registerSvgIcons(icons);
  }

  encodeString(str: string): string {
    return encodeURIComponent(str);
  }

  replaceSpecialCharacter(str: string): string {
    return str.replace(/%/gi, "%25")
  }

  getEncodedS3Url(str: string): string {
    str = this.encodeString(str);
    str = this.replaceSpecialCharacter(str);
    return 'https://dataservices-icons.s3.eu-central-1.amazonaws.com/' + str + '.svg';
  }
}

