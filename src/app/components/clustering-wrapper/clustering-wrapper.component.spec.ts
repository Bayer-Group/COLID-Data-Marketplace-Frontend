import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ClusteringWrapperComponent } from "./clustering-wrapper.component";

describe("ClusteringWrapperComponent", () => {
  let component: ClusteringWrapperComponent;
  let fixture: ComponentFixture<ClusteringWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClusteringWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClusteringWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
