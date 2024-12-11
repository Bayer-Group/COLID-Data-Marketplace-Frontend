import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginInProgressComponent } from './login-in-progress.component';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { MockAuthService } from '../../mocks/unit-test-mocks';

describe('LoginInProgressComponent', () => {
  let component: LoginInProgressComponent;
  let fixture: ComponentFixture<LoginInProgressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginInProgressComponent],
      providers: [
        {
          provide: AuthService,
          useClass: MockAuthService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
