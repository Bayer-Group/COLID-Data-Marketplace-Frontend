import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  MockAuthService,
  MockTitleService,
  MockColidMatSnackBarService,
  MockMatDialogRef,
  mockActivatedRoute
} from 'src/app/shared/mocks/unit-test-mocks';
import { ToggleSidebar } from 'src/app/states/sidebar.state';
import { CreateDefaultSearchFilterDataMarketplace } from 'src/app/states/user-info.state';
import { SearchFilterDataMarketplaceDto } from 'src/app/shared/models/user/search-filter-data-marketplace-dto';
import { ActiveRangeFilters } from 'src/app/shared/models/active-range-filters';
import { of } from 'rxjs';
import { SearchFilterCollectionDto } from 'src/app/shared/models/user/search-filter-collection-dto';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [
        NgxsModule.forRoot(),
        CommonModule,
        RouterModule,
        MatToolbarModule,
        MatIconModule,
        MatMenuModule
      ],
      providers: [
        {
          provide: AuthService,
          useClass: MockAuthService
        },
        {
          provide: Title,
          useClass: MockTitleService
        },
        {
          provide: ColidMatSnackBarService,
          useClass: MockColidMatSnackBarService
        },
        {
          provide: MatDialogRef,
          useClass: MockMatDialogRef
        },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.environmentLabel).toBe(environment.Label);
  });

  it('should open help dialog', () => {
    const spy = spyOn(component['dialog'], 'open').and.stub();

    component.openHelpDialog();

    expect(spy).toHaveBeenCalled();
  });

  it('should open release notes dialog', () => {
    const spy = spyOn(component['dialog'], 'open').and.stub();

    component.showReleaseNotes();

    expect(spy).toHaveBeenCalled();
  });

  it('should navigate to editor', () => {
    const spy = spyOn(window, 'open').and.stub();

    component.goToEditor();

    expect(spy).toHaveBeenCalledWith(environment.pidUrl, '_blank');
  });

  it('should navigate to relationship manager', () => {
    const spy = spyOn(window, 'open').and.stub();

    component.goToRRM();

    expect(spy).toHaveBeenCalledWith(environment.rrmUrl, '_blank');
  });

  it('should toggle sidebar', () => {
    const spy = spyOn(component['store'], 'dispatch').and.stub();

    component.toggleNavbar();

    expect(spy).toHaveBeenCalledWith(new ToggleSidebar());
  });

  it('should save active aggregations as default', () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2024-12-12'));

    const mockAggregationFilters: Map<string, string[]> = new Map<
      string,
      string[]
    >();
    mockAggregationFilters.set('testKey', ['testValue']);

    const mockRangeFilters: ActiveRangeFilters = {
      testValue: {
        from: '1',
        to: '2'
      }
    };

    const mockSearchText = 'mock search text';

    component.activeAggregations = mockAggregationFilters;
    component.activeRangeFilters = mockRangeFilters;
    component.searchText = mockSearchText;

    const expectedNewDefaultSearchFilters: SearchFilterDataMarketplaceDto =
      new SearchFilterDataMarketplaceDto(
        'default search filter at 2024-12-12T00:00:00.000Z',
        mockSearchText,
        new SearchFilterCollectionDto(
          {
            testKey: ['testValue']
          },
          {
            testValue: {
              from: '1',
              to: '2'
            }
          }
        )
      );
    const spy = spyOn(component['store'], 'dispatch').and.returnValue(of(true));

    component.saveActiveAggregationAsDefault();

    expect(spy).toHaveBeenCalledWith(
      new CreateDefaultSearchFilterDataMarketplace(
        expectedNewDefaultSearchFilters
      )
    );

    jasmine.clock().uninstall();
  });
});
