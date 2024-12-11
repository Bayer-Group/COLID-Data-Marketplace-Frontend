import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPanelComponent } from './filter-panel.component';
import { NgxsModule } from '@ngxs/store';
import { MatDialogModule } from '@angular/material/dialog';
import { LogService } from 'src/app/core/logging/log.service';
import {
  mockActivatedRoute,
  MockColidSpinnerComponent,
  MockLogService
} from 'src/app/shared/mocks/unit-test-mocks';
import { ActivatedRoute, RouterModule } from '@angular/router';

describe('FilterPanelComponent', () => {
  let component: FilterPanelComponent;
  let fixture: ComponentFixture<FilterPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterPanelComponent, MockColidSpinnerComponent],
      imports: [NgxsModule.forRoot(), RouterModule, MatDialogModule],
      providers: [
        {
          provide: LogService,
          useClass: MockLogService
        },
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
