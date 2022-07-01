import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervalNotificationDiallogComponent } from './interval-notification-diallog.component';

describe('IntervalNotificationDiallogComponent', () => {
  let component: IntervalNotificationDiallogComponent;
  let fixture: ComponentFixture<IntervalNotificationDiallogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntervalNotificationDiallogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntervalNotificationDiallogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
