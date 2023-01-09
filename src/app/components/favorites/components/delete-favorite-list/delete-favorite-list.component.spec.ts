import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteFavoriteListComponent } from './delete-favorite-list.component';



describe('DeleteFavoriteListComponent', () => {
  let component: DeleteFavoriteListComponent;
  let fixture: ComponentFixture<DeleteFavoriteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteFavoriteListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteFavoriteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});