import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FavoritesOpenComponent } from './favorites-open.component';

describe('FavoritesOpenComponent', () => {
  let component: FavoritesOpenComponent;
  let fixture: ComponentFixture<FavoritesOpenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoritesOpenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
