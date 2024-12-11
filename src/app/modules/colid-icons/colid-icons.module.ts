import { NgModule, ModuleWithProviders } from '@angular/core';
import { ColidIconsComponent } from './components/colid-icons.component';
import { ColidIconsService } from './services/colid-icons.service';
import { fas } from '@fortawesome/free-solid-svg-icons';
import {
  FontAwesomeModule,
  FaIconLibrary
} from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ColidIconsComponent],
  imports: [CommonModule, MatTooltipModule, FontAwesomeModule, MatIconModule],
  exports: [ColidIconsComponent]
})
export class ColidIconsModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }

  static forRoot(): ModuleWithProviders<ColidIconsModule> {
    return {
      ngModule: ColidIconsModule,
      providers: [ColidIconsService]
    };
  }
}
