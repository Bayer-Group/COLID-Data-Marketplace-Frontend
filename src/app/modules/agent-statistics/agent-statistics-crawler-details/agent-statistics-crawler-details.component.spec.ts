import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AgentStatisticsCrawlerDetailsComponent } from "./agent-statistics-crawler-details.component";

describe("AgentStatisticsCrawlerDetailsComponent", () => {
  let component: AgentStatisticsCrawlerDetailsComponent;
  let fixture: ComponentFixture<AgentStatisticsCrawlerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgentStatisticsCrawlerDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentStatisticsCrawlerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
