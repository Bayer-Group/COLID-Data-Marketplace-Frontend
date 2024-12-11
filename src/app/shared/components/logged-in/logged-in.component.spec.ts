import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedInComponent } from './logged-in.component';
import { MockAuthService } from '../../mocks/unit-test-mocks';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';

describe('LoggedInComponent', () => {
  let component: LoggedInComponent;
  let fixture: ComponentFixture<LoggedInComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoggedInComponent],
      providers: [
        {
          provide: AuthService,
          useClass: MockAuthService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoggedInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
