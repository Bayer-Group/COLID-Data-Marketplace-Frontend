import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewDescriptionDialogComponent } from './view-description-dialog.component';



describe('ViewDescriptionDialogComponent', () => {
  let component: ViewDescriptionDialogComponent;
  let fixture: ComponentFixture<ViewDescriptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDescriptionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDescriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});