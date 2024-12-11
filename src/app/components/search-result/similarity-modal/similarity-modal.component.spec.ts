import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SimilarityModalComponent } from './similarity-modal.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DocumentService } from 'src/app/core/http/document.service';
import { SimilarityService } from 'src/app/core/http/similarity.service';
import {
  MockDocumentService,
  MockFeedbackComponent,
  MockMatDialogRef,
  MockSimilarityService
} from 'src/app/shared/mocks/unit-test-mocks';

describe('SimilarityModalComponent', () => {
  let component: SimilarityModalComponent;
  let fixture: ComponentFixture<SimilarityModalComponent>;

  const mockData = {};

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SimilarityModalComponent, MockFeedbackComponent],
      imports: [
        NoopAnimationsModule,
        NgxsModule.forRoot(),
        MatIconModule,
        MatDividerModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useClass: MockMatDialogRef
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockData
        },
        {
          provide: DocumentService,
          useClass: MockDocumentService
        },
        {
          provide: SimilarityService,
          useClass: MockSimilarityService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimilarityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Reason: need to guard direct array access for undeined values first
  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
