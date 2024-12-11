import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageViewerDialogComponent } from './image-viewer-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxImageZoomModule } from 'ngx-image-zoom';

// TODO: needs proper data mocks
xdescribe('ImageViewerDialogComponent', () => {
  let component: ImageViewerDialogComponent;
  let fixture: ComponentFixture<ImageViewerDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageViewerDialogComponent],
      imports: [
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        NgxImageZoomModule
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            index: 0,
            images: []
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ImageViewerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
