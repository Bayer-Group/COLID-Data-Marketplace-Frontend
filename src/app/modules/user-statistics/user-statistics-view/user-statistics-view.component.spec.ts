import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStatisticsViewComponent } from './user-statistics-view.component';
import {
  MockColidSpinnerComponent,
  MockUserInfoApiService
} from 'src/app/shared/mocks/unit-test-mocks';
import { UserInfoApiService } from 'src/app/core/http/user-info.api.service';

describe('UserStatisticsViewComponent', () => {
  let component: UserStatisticsViewComponent;
  let fixture: ComponentFixture<UserStatisticsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserStatisticsViewComponent, MockColidSpinnerComponent],
      providers: [
        {
          provide: UserInfoApiService,
          useClass: MockUserInfoApiService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserStatisticsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
