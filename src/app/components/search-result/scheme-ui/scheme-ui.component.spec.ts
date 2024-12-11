import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeUIComponent } from './scheme-ui.component';
import { NgxsModule } from '@ngxs/store';
import { MatDialogModule } from '@angular/material/dialog';
import {
  MockColidSpinnerComponent,
  MockDocumentService
} from 'src/app/shared/mocks/unit-test-mocks';
import { DocumentService } from 'src/app/core/http/document.service';
import { DatePipe } from '@angular/common';

describe('SchemeUIComponent', () => {
  let component: SchemeUIComponent;
  let fixture: ComponentFixture<SchemeUIComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchemeUIComponent, MockColidSpinnerComponent],
      imports: [NgxsModule.forRoot(), MatDialogModule],
      providers: [
        {
          provide: DocumentService,
          useClass: MockDocumentService
        },
        DatePipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SchemeUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
