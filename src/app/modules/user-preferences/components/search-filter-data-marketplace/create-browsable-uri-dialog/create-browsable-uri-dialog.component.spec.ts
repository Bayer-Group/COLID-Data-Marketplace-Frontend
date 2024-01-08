import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CreateBrowsableUriDialogComponent } from "./create-browsable-uri-dialog.component";

describe("CreateBrowsableUriDialogComponent", () => {
  let component: CreateBrowsableUriDialogComponent;
  let fixture: ComponentFixture<CreateBrowsableUriDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateBrowsableUriDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBrowsableUriDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
