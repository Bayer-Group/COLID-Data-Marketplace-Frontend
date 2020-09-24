import { ColidSpinnerComponent } from './components/colid-spinner/colid-spinner.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    ColidSpinnerComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  exports: [
    ColidSpinnerComponent
  ]
})
export class SharedModule { }
