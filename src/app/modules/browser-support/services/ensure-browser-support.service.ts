import { Injectable } from '@angular/core';
import { isError } from 'util';

declare const InstallTrigger: any;

@Injectable({
  providedIn: 'root'
})
export class EnsureBrowserSupportService {

  public isSupported(): boolean {
    const isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
    return !isIEOrEdge;
  }

}
