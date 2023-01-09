import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditFavoriteListComponent } from './edit-favorite-list.component';



describe('EditFavoriteListComponent', () => {
  let component: EditFavoriteListComponent;
  let fixture: ComponentFixture<EditFavoriteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFavoriteListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFavoriteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});