import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputAttachmentComponent } from './form-item-input-attachment.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AttachmentApiService } from 'src/app/core/http/attachment.api.service';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { FormService } from 'src/app/shared/services/form.service';
import {
  MockFormItemErrorsComponent,
  MockFormComponent,
  MockFormService,
  MockAttachmentApiService,
  MockColidMatSnackBarService
} from 'src/app/shared/mocks/unit-test-mocks';

describe('FormItemInputAttachmentComponent', () => {
  let component: FormItemInputAttachmentComponent;
  let fixture: ComponentFixture<FormItemInputAttachmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormItemInputAttachmentComponent,
        MockFormItemErrorsComponent,
        MockFormComponent
      ],
      imports: [MatDialogModule],
      providers: [
        {
          provide: FormService,
          useClass: MockFormService
        },
        {
          provide: AttachmentApiService,
          useClass: MockAttachmentApiService
        },
        {
          provide: ColidMatSnackBarService,
          useClass: MockColidMatSnackBarService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormItemInputAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
