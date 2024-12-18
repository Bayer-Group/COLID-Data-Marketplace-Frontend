import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColidMatSnackBarComponent } from './colid-mat-snack-bar/colid-mat-snack-bar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ColidMatSnackBarService } from './colid-mat-snack-bar.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  declarations: [ColidMatSnackBarComponent],
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    ClipboardModule
  ]
})
export class ColidSnackBarModule {
  static forRoot(): ModuleWithProviders<ColidSnackBarModule> {
    return {
      ngModule: ColidSnackBarModule,
      providers: [ColidMatSnackBarService]
    };
  }
}
