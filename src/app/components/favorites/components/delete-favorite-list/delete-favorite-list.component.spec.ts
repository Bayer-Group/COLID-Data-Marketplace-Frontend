import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteFavoriteListComponent } from './delete-favorite-list.component';
import { NgxsModule } from '@ngxs/store';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

describe('DeleteFavoriteListComponent', () => {
  let component: DeleteFavoriteListComponent;
  let fixture: ComponentFixture<DeleteFavoriteListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteFavoriteListComponent],
      imports: [NgxsModule.forRoot(), MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteFavoriteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
