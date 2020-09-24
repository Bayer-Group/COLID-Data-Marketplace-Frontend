import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPreferencesGeneralComponent } from './user-preferences-general.component';

describe('UserPreferencesGeneralComponent', () => {
  let component: UserPreferencesGeneralComponent;
  let fixture: ComponentFixture<UserPreferencesGeneralComponent>;

  beforeEach(async(() => {
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
