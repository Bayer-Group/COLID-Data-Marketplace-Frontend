import { Component, OnInit } from '@angular/core';
import { EnsureBrowserSupportService } from '../services/ensure-browser-support.service';

declare const InstallTrigger: any;

@Component({
  selector: 'ensure-browser-support',
  templateUrl: './ensure-browser-support.component.html',
  styles: []
})
export class BrowserSupportComponent implements OnInit {

  supportedBrowser: boolean;

  constructor(private ensureBrowserSupportService: EnsureBrowserSupportService) {
  }

  ngOnInit() {
    this.supportedBrowser = this.ensureBrowserSupportService.isSupported();
  }
}
