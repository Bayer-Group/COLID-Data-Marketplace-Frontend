import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphFileUploadComponent } from './graph-file-upload.component';
import { PrettySizePipe } from 'src/app/shared/pipes/pretty-size.pipe';
import { MatHint } from '@angular/material/form-field';

describe('GraphFileUploadComponent', () => {
  let component: GraphFileUploadComponent;
  let fixture: ComponentFixture<GraphFileUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraphFileUploadComponent, PrettySizePipe],
      imports: [MatHint]
    }).compileComponents();

    fixture = TestBed.createComponent(GraphFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
