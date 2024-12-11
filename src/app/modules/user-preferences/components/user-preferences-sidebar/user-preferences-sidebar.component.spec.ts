import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPreferencesSidebarComponent } from './user-preferences-sidebar.component';
import { NgxsModule } from '@ngxs/store';
import { MatListModule, MatNavList } from '@angular/material/list';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { mockActivatedRoute } from 'src/app/shared/mocks/unit-test-mocks';

describe('UserPreferencesSidebarComponent', () => {
  let component: UserPreferencesSidebarComponent;
  let fixture: ComponentFixture<UserPreferencesSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserPreferencesSidebarComponent],
      imports: [
        NgxsModule.forRoot(),
        MatNavList,
        MatListModule,
        RouterModule,
        MatIconModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserPreferencesSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
