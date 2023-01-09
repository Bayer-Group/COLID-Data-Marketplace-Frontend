import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RemoveFavoriteEntryComponent } from './remove-favorite-entry.component';



describe('RemoveFavoriteEntryComponent', () => {
  let component: RemoveFavoriteEntryComponent;
  let fixture: ComponentFixture<RemoveFavoriteEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveFavoriteEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveFavoriteEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});