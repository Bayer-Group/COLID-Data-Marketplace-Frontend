import { ColidSpinnerComponent } from './components/colid-spinner/colid-spinner.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EditorAccessControlDirective } from './directives/editor-access-control.directive';
import { MetadataGroupByPipe } from './pipes/metadata-group-by.pipe';

@NgModule({
  declarations: [
    ColidSpinnerComponent,
    EditorAccessControlDirective,
    MetadataGroupByPipe,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  exports: [
    ColidSpinnerComponent,
    MetadataGroupByPipe,
    EditorAccessControlDirective,
  ]
})
export class SharedModule { }
