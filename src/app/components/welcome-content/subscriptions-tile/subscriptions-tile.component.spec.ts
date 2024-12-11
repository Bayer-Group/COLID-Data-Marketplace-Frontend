import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionsTileComponent } from './subscriptions-tile.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxsModule } from '@ngxs/store';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MockResourceItemTileComponent } from 'src/app/shared/mocks/unit-test-mocks';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('SubscriptionsTileComponent', () => {
  let component: SubscriptionsTileComponent;
  let fixture: ComponentFixture<SubscriptionsTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionsTileComponent, MockResourceItemTileComponent],
      imports: [
        MatDialogModule,
        NgxsModule.forRoot(),
        MatExpansionModule,
        MatListModule,
        MatProgressSpinnerModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionsTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
