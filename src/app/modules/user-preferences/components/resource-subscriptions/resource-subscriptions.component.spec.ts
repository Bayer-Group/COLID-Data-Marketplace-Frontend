import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceSubscriptionsComponent } from './resource-subscriptions.component';
import { NgxsModule } from '@ngxs/store';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import {
  MockColidIconsComponent,
  MockColidMatSnackBarService
} from 'src/app/shared/mocks/unit-test-mocks';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

describe('ResourceSubscriptionsComponent', () => {
  let component: ResourceSubscriptionsComponent;
  let fixture: ComponentFixture<ResourceSubscriptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceSubscriptionsComponent, MockColidIconsComponent],
      imports: [
        NgxsModule.forRoot(),
        MatButtonModule,
        MatIconModule,
        MatListModule
      ],
      providers: [
        {
          provide: ColidMatSnackBarService,
          useClass: MockColidMatSnackBarService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
