import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PidUriTemplateTableComponent } from './pid-uri-template-table.component';
import { NgxsModule } from '@ngxs/store';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import {
  MockColidMatSnackBarService,
  MockColidSpinnerComponent,
  MockEntityFormService
} from 'src/app/shared/mocks/unit-test-mocks';
import { EntityFormService } from 'src/app/shared/services/entity-form.service';

describe('PidUriTemplateTableComponent', () => {
  let component: PidUriTemplateTableComponent;
  let fixture: ComponentFixture<PidUriTemplateTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PidUriTemplateTableComponent, MockColidSpinnerComponent],
      imports: [NgxsModule.forRoot(), FormsModule, MatDialogModule],
      providers: [
        {
          provide: ColidMatSnackBarService,
          useClass: MockColidMatSnackBarService
        },
        {
          provide: EntityFormService,
          useClass: MockEntityFormService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PidUriTemplateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
