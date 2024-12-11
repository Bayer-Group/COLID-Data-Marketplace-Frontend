import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPreferencesComponent } from './user-preferences.component';
import { NgxsModule } from '@ngxs/store';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MockUserPreferencesSidebarComponent } from 'src/app/shared/mocks/unit-test-mocks';
import { RouterModule } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UserPreferencesComponent', () => {
  let component: UserPreferencesComponent;
  let fixture: ComponentFixture<UserPreferencesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserPreferencesComponent,
        MockUserPreferencesSidebarComponent
      ],
      imports: [
        NoopAnimationsModule,
        NgxsModule.forRoot(),
        RouterModule,
        MatSidenavModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
