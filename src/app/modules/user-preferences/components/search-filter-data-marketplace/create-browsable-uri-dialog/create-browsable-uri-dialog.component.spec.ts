import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBrowsableUriDialogComponent } from './create-browsable-uri-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import {
  MockActionButtonComponent,
  MockColidMatSnackBarService
} from 'src/app/shared/mocks/unit-test-mocks';

describe('CreateBrowsableUriDialogComponent', () => {
  let component: CreateBrowsableUriDialogComponent;
  let fixture: ComponentFixture<CreateBrowsableUriDialogComponent>;

  const mockData = {
    search: {
      searchTerm: 'test',
      filterJson: {
        aggregations: []
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CreateBrowsableUriDialogComponent,
        MockActionButtonComponent
      ],
      imports: [
        NoopAnimationsModule,
        NgxsModule.forRoot(),
        MatIconModule,
        MatDividerModule
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockData
        },
        {
          provide: ColidMatSnackBarService,
          useClass: MockColidMatSnackBarService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBrowsableUriDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
