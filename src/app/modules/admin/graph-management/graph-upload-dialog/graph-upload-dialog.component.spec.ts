import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphUploadDialogComponent } from './graph-upload-dialog.component';
import { MockGraphManagementApiService } from 'src/app/shared/mocks/unit-test-mocks';
import { GraphManagementApiService } from 'src/app/core/http/graph-management-api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';

// TODO: there is a possible error in this class, needs further investigation
// Error: NG01203: No value accessor for form control name: 'graphFile'.
xdescribe('GraphUploadDialogComponent', () => {
  let component: GraphUploadDialogComponent;
  let fixture: ComponentFixture<GraphUploadDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraphUploadDialogComponent],
      imports: [
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule
      ],
      providers: [
        {
          provide: GraphManagementApiService,
          useClass: MockGraphManagementApiService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GraphUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
