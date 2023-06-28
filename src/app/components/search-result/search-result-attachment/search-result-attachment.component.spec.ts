import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { SearchResultAttachmentComponent } from "./search-result-attachment.component";

describe("SearchResultAttachmentComponent", () => {
  let component: SearchResultAttachmentComponent;
  let fixture: ComponentFixture<SearchResultAttachmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SearchResultAttachmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
