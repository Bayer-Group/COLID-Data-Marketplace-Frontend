import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPreferencesGeneralComponent } from './user-preferences-general.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MockColidSpinnerComponent } from 'src/app/shared/mocks/unit-test-mocks';

describe('UserPreferencesGeneralComponent', () => {
  let component: UserPreferencesGeneralComponent;
  let fixture: ComponentFixture<UserPreferencesGeneralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserPreferencesGeneralComponent,
        MockColidSpinnerComponent
      ],
      imports: [
        NoopAnimationsModule,
        NgxsModule.forRoot(),
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserPreferencesGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
