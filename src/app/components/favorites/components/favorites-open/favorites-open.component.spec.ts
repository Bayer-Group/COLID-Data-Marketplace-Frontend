import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritesOpenComponent } from './favorites-open.component';
import { NgxsModule } from '@ngxs/store';
import {
  MockAuthService,
  MockFavoriteListComponent,
  MockSearchResultComponent
} from 'src/app/shared/mocks/unit-test-mocks';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('FavoritesOpenComponent', () => {
  let component: FavoritesOpenComponent;
  let fixture: ComponentFixture<FavoritesOpenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FavoritesOpenComponent,
        MockFavoriteListComponent,
        MockSearchResultComponent
      ],
      imports: [
        NgxsModule.forRoot(),
        MatSidenavModule,
        MatButton,
        MatInputModule,
        FormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
