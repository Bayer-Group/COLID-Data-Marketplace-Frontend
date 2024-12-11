import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAnalyticsComponent } from './system-analytics.component';
import { NgxsModule } from '@ngxs/store';
import { MockColidSpinnerComponent } from 'src/app/shared/mocks/unit-test-mocks';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

describe('SystemAnalyticsComponent', () => {
  let component: SystemAnalyticsComponent;
  let fixture: ComponentFixture<SystemAnalyticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SystemAnalyticsComponent, MockColidSpinnerComponent],
      imports: [
        NgxsModule.forRoot(),
        MatButtonModule,
        MatIconModule,
        MatCardModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SystemAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
