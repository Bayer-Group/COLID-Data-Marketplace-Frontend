import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsTileComponent } from './notifications-tile.component';
import { NgxsModule } from '@ngxs/store';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('NotificationsTileComponent', () => {
  let component: NotificationsTileComponent;
  let fixture: ComponentFixture<NotificationsTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationsTileComponent],
      imports: [
        NgxsModule.forRoot(),
        MatDialogModule,
        MatExpansionModule,
        MatIconModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
