import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceStatusIndicatorsComponent } from './resource-status-indicators.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { of } from 'rxjs';
import { Constants } from 'src/app/shared/constants';
import {
  MockAuthService,
  MockColidIconsComponent
} from 'src/app/shared/mocks/unit-test-mocks';

describe('ResourceStatusIndicatorsComponent', () => {
  let component: ResourceStatusIndicatorsComponent;
  let fixture: ComponentFixture<ResourceStatusIndicatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockColidIconsComponent],
      imports: [
        ResourceStatusIndicatorsComponent,
        NoopAnimationsModule,
        MatChipsModule,
        MatTooltipModule
      ],
      providers: [
        {
          provide: AuthService,
          useClass: MockAuthService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceStatusIndicatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should verify user has create privilege', () => {
    spyOnProperty(
      component['authService'],
      'hasCreatePrivilege$'
    ).and.returnValue(of(true));

    component.ngOnInit();

    expect(component.hasCreatePrivilege).toBeTrue();
  });

  it('should color entry draft indicator', () => {
    component.ngOnChanges({
      entryLifeCycleStatus: {
        currentValue: Constants.Resource.LifeCycleStatus.Draft,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.entryChipColor).toBe('draft');
  });

  it('should color entry published indicator', () => {
    component.ngOnChanges({
      entryLifeCycleStatus: {
        currentValue: Constants.Resource.LifeCycleStatus.Published,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.entryChipColor).toBe('published');
  });

  it('should color entry marked for deletion indicator', () => {
    component.ngOnChanges({
      entryLifeCycleStatus: {
        currentValue: Constants.Resource.LifeCycleStatus.MarkedDeletion,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.entryChipColor).toBe('deleted');
  });

  it('should throw error for unexpected entry lifecycle status', () => {
    expect(() => {
      component.ngOnChanges({
        entryLifeCycleStatus: {
          currentValue: Constants.Resource.LifeCycleStatus.Historic,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true
        }
      });
    }).toThrowError();

    expect(component.entryChipColor).toBeUndefined();
  });

  it('should color resource linked draft indicator', () => {
    component.ngOnChanges({
      resourceLinkedLifecycleStatus: {
        currentValue: Constants.Resource.LifeCycleStatus.Draft,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.resourceLinkedChipColor).toBe('draft');
  });

  it('should color resource linked published indicator', () => {
    component.ngOnChanges({
      resourceLinkedLifecycleStatus: {
        currentValue: Constants.Resource.LifeCycleStatus.Published,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.resourceLinkedChipColor).toBe('published');
  });

  it('should color resource linked marked for deletion indicator', () => {
    component.ngOnChanges({
      resourceLinkedLifecycleStatus: {
        currentValue: Constants.Resource.LifeCycleStatus.MarkedDeletion,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.resourceLinkedChipColor).toBe('deleted');
  });

  it('should throw error for unexpected resource linked lifecycle status', () => {
    expect(() => {
      component.ngOnChanges({
        resourceLinkedLifecycleStatus: {
          currentValue: Constants.Resource.LifeCycleStatus.Historic,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true
        }
      });
    }).toThrowError();

    expect(component.resourceLinkedChipColor).toBeUndefined();
  });

  it('should show resource status indicators for user with privilege', () => {
    component.hasCreatePrivilege = true;

    component.ngOnChanges({
      resourceLinkedLifecycleStatus: {
        currentValue: Constants.Resource.LifeCycleStatus.Published,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.showResourceStatusIndicator).toBeTrue();
  });

  it('should not show resource status indicators for user without privilege', () => {
    component.hasCreatePrivilege = false;

    component.ngOnChanges({
      resourceLinkedLifecycleStatus: {
        currentValue: Constants.Resource.LifeCycleStatus.Published,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.showResourceStatusIndicator).toBeFalse();
  });

  it('should show marked for deletion indicator to all users', () => {
    component.hasCreatePrivilege = false;

    component.ngOnChanges({
      resourceLinkedLifecycleStatus: {
        currentValue: Constants.Resource.LifeCycleStatus.MarkedDeletion,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.showResourceStatusIndicator).toBeFalse();
  });
});
