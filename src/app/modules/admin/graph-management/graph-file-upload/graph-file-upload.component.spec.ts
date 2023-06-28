import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { GraphFileUploadComponent } from "./graph-file-upload.component";

describe("GraphFileUploadComponent", () => {
  let component: GraphFileUploadComponent;
  let fixture: ComponentFixture<GraphFileUploadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GraphFileUploadComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
