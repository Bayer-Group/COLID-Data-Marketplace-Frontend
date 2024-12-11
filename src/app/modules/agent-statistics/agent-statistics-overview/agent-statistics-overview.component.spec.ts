import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentStatisticsOverviewComponent } from './agent-statistics-overview.component';
import { AgentStatisticsApiService } from 'src/app/core/http/agent-statistics.api.service';
import { RouterModule } from '@angular/router';
import {
  MockAgentStatisticsApiService,
  MockColidSpinnerComponent
} from 'src/app/shared/mocks/unit-test-mocks';

describe('AgentStatisticsOverviewComponent', () => {
  let component: AgentStatisticsOverviewComponent;
  let fixture: ComponentFixture<AgentStatisticsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AgentStatisticsOverviewComponent,
        MockColidSpinnerComponent
      ],
      imports: [RouterModule],
      providers: [
        {
          provide: AgentStatisticsApiService,
          useClass: MockAgentStatisticsApiService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgentStatisticsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
