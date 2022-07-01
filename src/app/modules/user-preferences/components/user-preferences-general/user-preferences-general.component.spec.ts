import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserPreferencesGeneralComponent } from './user-preferences-general.component';

describe('UserPreferencesGeneralComponent', () => {
  let component: UserPreferencesGeneralComponent;
  let fixture: ComponentFixture<UserPreferencesGeneralComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPreferencesGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPreferencesGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
