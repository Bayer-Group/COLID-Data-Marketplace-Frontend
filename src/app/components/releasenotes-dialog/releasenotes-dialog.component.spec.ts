import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasenotesDialogComponent } from './releasenotes-dialog.component';
import { NgxsModule } from '@ngxs/store';
import { MarkdownModule } from 'ngx-markdown';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

describe('ReleasenotesDialogComponent', () => {
  let component: ReleasenotesDialogComponent;
  let fixture: ComponentFixture<ReleasenotesDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReleasenotesDialogComponent],
      imports: [
        NgxsModule.forRoot(),
        MarkdownModule.forRoot(),
        MatDialogModule,
        MatIconModule,
        MatButtonModule
      ],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(ReleasenotesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
