import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordManagementComponent } from './keyword-management.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxsModule } from '@ngxs/store';
import { ColidMatSnackBarService } from '../../colid-mat-snack-bar/colid-mat-snack-bar.service';
import { MockColidMatSnackBarService } from 'src/app/shared/mocks/unit-test-mocks';

describe('KeywordManagementComponent', () => {
  let component: KeywordManagementComponent;
  let fixture: ComponentFixture<KeywordManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeywordManagementComponent],
      imports: [MatDialogModule, NgxsModule.forRoot()],
      providers: [
        {
          provide: ColidMatSnackBarService,
          useClass: MockColidMatSnackBarService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(KeywordManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
