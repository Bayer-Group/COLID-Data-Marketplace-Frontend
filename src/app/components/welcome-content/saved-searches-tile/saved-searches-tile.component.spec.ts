import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedSearchesTileComponent } from './saved-searches-tile.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxsModule } from '@ngxs/store';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SavedSearchesTileComponent', () => {
  let component: SavedSearchesTileComponent;
  let fixture: ComponentFixture<SavedSearchesTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SavedSearchesTileComponent],
      imports: [
        NoopAnimationsModule,
        NgxsModule.forRoot(),
        MatDialogModule,
        MatExpansionModule,
        MatDividerModule,
        MatIconModule,
        MatProgressSpinnerModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SavedSearchesTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
