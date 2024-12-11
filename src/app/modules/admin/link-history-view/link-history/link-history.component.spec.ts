import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkHistoryComponent } from './link-history.component';
import {
  MockColidIconsComponent,
  MockColidMatSnackBarService,
  MockResourceApiService
} from 'src/app/shared/mocks/unit-test-mocks';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { MatDialogModule } from '@angular/material/dialog';
import { ResourceApiService } from 'src/app/core/http/resource.api.service';
import { NgxsModule } from '@ngxs/store';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LinkHistoryComponent', () => {
  let component: LinkHistoryComponent;
  let fixture: ComponentFixture<LinkHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockColidIconsComponent],
      imports: [
        LinkHistoryComponent,
        MatDialogModule,
        NgxsModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        {
          provide: ColidMatSnackBarService,
          useClass: MockColidMatSnackBarService
        },
        {
          provide: ResourceApiService,
          useClass: MockResourceApiService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LinkHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
