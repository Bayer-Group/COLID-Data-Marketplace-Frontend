import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentStatisticsCrawlerDetailsComponent } from './agent-statistics-crawler-details.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AgentStatisticsApiService } from 'src/app/core/http/agent-statistics.api.service';
import {
  MockAgentStatisticsApiService,
  MockColidSpinnerComponent
} from 'src/app/shared/mocks/unit-test-mocks';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core';
import { DATE_FORMAT } from 'src/app/shared/components/form-item/form-item-input/form-item-input-datetime/form-item-input-datetime.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AgentStatisticsCrawlerDetailsComponent', () => {
  let component: AgentStatisticsCrawlerDetailsComponent;
  let fixture: ComponentFixture<AgentStatisticsCrawlerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AgentStatisticsCrawlerDetailsComponent,
        MockColidSpinnerComponent
      ],
      imports: [
        NoopAnimationsModule,
        RouterModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatButtonModule,
        MatIconModule
      ],
      providers: [
        {
          provide: DateAdapter,
          useClass: MomentDateAdapter,
          deps: [MAT_DATE_LOCALE]
        },
        { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                crawlerName: 'test',
                startDate: '2023-06-17',
                endDate: '2023-06-23'
              }
            }
          }
        },
        {
          provide: AgentStatisticsApiService,
          useClass: MockAgentStatisticsApiService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgentStatisticsCrawlerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
