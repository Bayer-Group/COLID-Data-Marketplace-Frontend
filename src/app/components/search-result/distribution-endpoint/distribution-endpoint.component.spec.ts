import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionEndpointComponent } from './distribution-endpoint.component';
import { LogService } from 'src/app/core/logging/log.service';
import { ColidIconsModule } from 'src/app/modules/colid-icons/colid-icons.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MockLogService } from 'src/app/shared/mocks/unit-test-mocks';

describe('DistributionEndpointComponent', () => {
  let component: DistributionEndpointComponent;
  let fixture: ComponentFixture<DistributionEndpointComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DistributionEndpointComponent],
      imports: [
        NoopAnimationsModule,
        NgxsModule.forRoot(),
        TooltipModule,
        ColidIconsModule
      ],
      providers: [
        {
          provide: LogService,
          useClass: MockLogService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DistributionEndpointComponent);
    component = fixture.componentInstance;

    component.resource = [];
    component.endpoint = [];
    component.metadata = {
      properties: []
    };
    component.baseUriPointsAt = '';
    component.lastElement = false;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
