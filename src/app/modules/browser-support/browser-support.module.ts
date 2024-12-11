import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserSupportComponent } from './components/ensure-browser-support.component';

@NgModule({
  declarations: [BrowserSupportComponent],
  imports: [CommonModule],
  exports: [BrowserSupportComponent]
})
export class BrowserSupportModule {}
