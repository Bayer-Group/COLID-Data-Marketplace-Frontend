import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletionRequestComponent } from './deletion-request.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { ColidMatSnackBarService } from '../../colid-mat-snack-bar/colid-mat-snack-bar.service';
import { AuthService } from '../../authentication/services/auth.service';
import { MatSelectionList } from '@angular/material/list';
import {
  MockAuthService,
  MockColidMatSnackBarService
} from 'src/app/shared/mocks/unit-test-mocks';

describe('DeletionRequestComponent', () => {
  let component: DeletionRequestComponent;
  let fixture: ComponentFixture<DeletionRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletionRequestComponent],

      imports: [NoopAnimationsModule, NgxsModule.forRoot(), MatSelectionList],
      providers: [
        {
          provide: AuthService,
          useClass: MockAuthService
        },
        {
          provide: ColidMatSnackBarService,
          useClass: MockColidMatSnackBarService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeletionRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
