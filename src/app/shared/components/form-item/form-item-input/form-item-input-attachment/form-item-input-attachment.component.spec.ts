import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { FormItemInputAttachmentComponent } from "./form-item-input-attachment.component";

describe("FormItemInputAttachmentComponent", () => {
  let component: FormItemInputAttachmentComponent;
  let fixture: ComponentFixture<FormItemInputAttachmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemInputAttachmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemInputAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
