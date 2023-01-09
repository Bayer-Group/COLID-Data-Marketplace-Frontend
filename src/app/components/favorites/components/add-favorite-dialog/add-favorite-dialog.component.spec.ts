import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddFavoriteDialogComponent } from './add-favorite-dialog.component';


describe('AddFavoriteDialogComponent', () => {
  let component: AddFavoriteDialogComponent;
  let fixture: ComponentFixture<AddFavoriteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFavoriteDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFavoriteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});