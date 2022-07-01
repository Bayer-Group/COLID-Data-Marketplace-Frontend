import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoginInProgressComponent } from './login-in-progress.component';

describe('LoginInProgressComponent', () => {
  let component: LoginInProgressComponent;
  let fixture: ComponentFixture<LoginInProgressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginInProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
