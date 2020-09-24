import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPreferencesSidebarComponent } from './user-preferences-sidebar.component';

describe('UserPreferencesSidebarComponent', () => {
  let component: UserPreferencesSidebarComponent;
  let fixture: ComponentFixture<UserPreferencesSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPreferencesSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPreferencesSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
