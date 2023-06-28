import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EditFavoriteEntryComponent } from "./edit-favorite-entry.component";

describe("EditFavoriteEntryComponent", () => {
  let component: EditFavoriteEntryComponent;
  let fixture: ComponentFixture<EditFavoriteEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditFavoriteEntryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFavoriteEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
