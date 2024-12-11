import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerGroupFormComponent } from './consumer-group-form.component';
import { NgxsModule } from '@ngxs/store';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  mockActivatedRoute,
  MockColidMatSnackBarService,
  MockConsumerGroupApiService
} from 'src/app/shared/mocks/unit-test-mocks';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { ConsumerGroupApiService } from 'src/app/core/http/consumer-group.api.service';

// TODO: needs route mocks
xdescribe('ConsumerGroupFormComponent', () => {
  let component: ConsumerGroupFormComponent;
  let fixture: ComponentFixture<ConsumerGroupFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsumerGroupFormComponent],
      imports: [NgxsModule.forRoot(), RouterModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        {
          provide: ColidMatSnackBarService,
          useClass: MockColidMatSnackBarService
        },
        {
          provide: ConsumerGroupApiService,
          useClass: MockConsumerGroupApiService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsumerGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
