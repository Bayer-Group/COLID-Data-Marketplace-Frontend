import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeContentComponent } from './welcome-content.component';
import {
  MockAuthService,
  MockLatestResourceChangesTileComponent,
  MockNotificationsTileComponent,
  MockSavedSearchesTileComponent,
  MockSubscriptionsTileComponent
} from 'src/app/shared/mocks/unit-test-mocks';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';

describe('WelcomeContentComponent', () => {
  let component: WelcomeContentComponent;
  let fixture: ComponentFixture<WelcomeContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        WelcomeContentComponent,
        MockSavedSearchesTileComponent,
        MockSubscriptionsTileComponent,
        MockNotificationsTileComponent,
        MockLatestResourceChangesTileComponent
      ],
      imports: [NgxsModule.forRoot()],
      providers: [
        {
          provide: AuthService,
          useClass: MockAuthService
        },
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: () => {
              return 'safeHtml';
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
