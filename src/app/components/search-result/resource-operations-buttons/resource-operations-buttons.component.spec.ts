import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceOperationsButtonsComponent } from './resource-operations-buttons.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgxsModule } from '@ngxs/store';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { SimpleChange, SimpleChanges } from '@angular/core';
import {
  AddColidEntrySubscription,
  RemoveColidEntrySubscription
} from 'src/app/states/user-info.state';
import { ColidEntrySubscriptionDto } from 'src/app/shared/models/user/colid-entry-subscription-dto';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Constants } from 'src/app/shared/constants';
import { MatDialogRef } from '@angular/material/dialog';
import { LogService } from 'src/app/core/logging/log.service';
import { environment } from 'src/environments/environment';
import { EditorAccessControlDirective } from 'src/app/shared/directives/editor-access-control.directive';

import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  DeleteDraftResource,
  MarkResourceAsDeleted,
  UnlinkResource
} from 'src/app/states/resource.state';
import { ResourceCreationType } from 'src/app/shared/models/resources/resource-creation-type';
import { MatMenuModule } from '@angular/material/menu';
import { DocumentMap } from 'src/app/shared/models/search-result';
import {
  MockColidMatSnackBarService,
  MockMatDialogRef,
  MockLogService,
  MockEditorAccessControlDirective
} from 'src/app/shared/mocks/unit-test-mocks';

describe('ResourceOperationsButtonsComponent', () => {
  let component: ResourceOperationsButtonsComponent;
  let fixture: ComponentFixture<ResourceOperationsButtonsComponent>;

  const mockUnsanitizedUri = '123/#abc';
  const mockSanitizedUri = '123/%23abc';
  const mockEntityType = 'MockType';

  const mockEvent: Event = {
    stopPropagation: function (): void {}
  } as Event;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: () => 'mockValue'
      }
    },
    queryParams: of({ key: 'value' })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ResourceOperationsButtonsComponent,
        NgxsModule.forRoot(),
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatMenuModule
      ],
      providers: [
        {
          provide: ColidMatSnackBarService,
          useClass: MockColidMatSnackBarService
        },
        {
          provide: MatDialogRef,
          useClass: MockMatDialogRef
        },
        {
          provide: LogService,
          useClass: MockLogService
        },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    TestBed.overrideComponent(ResourceOperationsButtonsComponent, {
      remove: { imports: [EditorAccessControlDirective] },
      add: { imports: [MockEditorAccessControlDirective] }
    });

    fixture = TestBed.createComponent(ResourceOperationsButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open resource in editor and log metadata', () => {
    const mockChanges: SimpleChanges = {
      pidUri: new SimpleChange(undefined, mockUnsanitizedUri, true),
      searchText: new SimpleChange(undefined, 'text', true),
      searchTimestamp: new SimpleChange(undefined, 'timestamp', true)
    };

    const spyOnWindow = spyOn(window, 'open').and.stub();
    const spyOnLogger = spyOn(component['logger'], 'info').and.stub();

    component.ngOnChanges(mockChanges);
    component.openInColidEditor(mockEvent);

    expect(spyOnWindow).toHaveBeenCalledWith(
      `${environment.pidUrl}resource/edit?pidUri=${mockSanitizedUri}`,
      '_blank'
    );

    expect(spyOnLogger).toHaveBeenCalledWith(
      'PID_RESULT_PAGE_RESOURCE_EDIT_CLICKED',
      {
        searchText: 'text',
        searchTimestamp: 'timestamp',
        resourcePIDUri: mockUnsanitizedUri
      }
    );
  });

  it('should open new window to change resource type', () => {
    const mockChanges: SimpleChanges = {
      pidUri: new SimpleChange(undefined, mockUnsanitizedUri, true)
    };

    const spyOnWindow = spyOn(window, 'open').and.stub();

    component.ngOnChanges(mockChanges);
    component.changeResourceType();

    expect(spyOnWindow).toHaveBeenCalledWith(
      `${environment.pidUrl}resource?pidUri=${mockSanitizedUri}&openChangeResourceTypeDialog=true`,
      '_blank'
    );
  });

  it("should show only 'delete draft' button when resource has draft version", () => {
    const mockChanges: SimpleChanges = {
      entryLifeCycleStatus: new SimpleChange(
        undefined,
        Constants.Resource.LifeCycleStatus.Draft,
        true
      )
    };

    component.ngOnChanges(mockChanges);

    expect(component.showDeleteDraftButton).toBeTrue();
    expect(component.showMarkForDeletionButton).toBeFalse();
  });

  it(
    "should show only 'mark for deletion' button when resource does not have draft version " +
      'and no linked draft or published versions',
    () => {
      const mockChanges: SimpleChanges = {
        entryLifeCycleStatus: new SimpleChange(
          undefined,
          Constants.Resource.LifeCycleStatus.Published,
          true
        )
      };

      component.ngOnChanges(mockChanges);

      expect(component.showDeleteDraftButton).toBeFalse();
      expect(component.showMarkForDeletionButton).toBeTrue();
    }
  );

  it('should open delete draft dialog on delete draft button click and proceed on confirmation', () => {
    const mockChanges: SimpleChanges = {
      pidUri: new SimpleChange(undefined, mockUnsanitizedUri, true)
    };

    const mockDeleteAction: DeleteDraftResource = new DeleteDraftResource(
      mockUnsanitizedUri
    );

    const spyOnDialog = spyOn(component['dialog'], 'open').and.returnValue({
      afterClosed: () => of(true)
    } as MatDialogRef<typeof component>);

    const spyOnDispatch = spyOn(component['store'], 'dispatch').and.returnValue(
      of(true)
    );

    component.ngOnChanges(mockChanges);
    component.deleteDraftResource();

    expect(spyOnDialog).toHaveBeenCalled();
    expect(spyOnDispatch).toHaveBeenCalledWith(mockDeleteAction);
  });

  it('should mark for deletion on mark for deletion button click', () => {
    const mockChanges: SimpleChanges = {
      pidUri: new SimpleChange(undefined, mockUnsanitizedUri, true)
    };

    const mockMarkResourceAsDeleted: MarkResourceAsDeleted =
      new MarkResourceAsDeleted(mockUnsanitizedUri);

    const spyOnDispatch = spyOn(component['store'], 'dispatch').and.returnValue(
      of(true)
    );

    component.ngOnChanges(mockChanges);
    component.markResourceForDeletion();

    expect(spyOnDispatch).toHaveBeenCalledWith(mockMarkResourceAsDeleted);
  });

  it('should open window to link this resource to another resource', () => {
    const mockChanges: SimpleChanges = {
      pidUri: new SimpleChange(undefined, mockUnsanitizedUri, true)
    };

    const spyOnWindow = spyOn(window, 'open').and.stub();

    component.ngOnChanges(mockChanges);
    component.linkResource();

    expect(spyOnWindow).toHaveBeenCalledWith(
      `${environment.pidUrl}resource?pidUri=${mockSanitizedUri}&openLinkingDialog=true`,
      '_blank'
    );
  });

  it('should show unlink button if there are inbound or outbound links', () => {
    const mockSource = {} as DocumentMap;
    mockSource[`https://pid.${environment.baseUrl}/kos/19050/hasVersions`] = {
      outbound: [
        {
          value: `https://pid.${environment.baseUrl}/kos/19050#b7611e3f-9854-45f7-8b34-04a00379cd5f`,
          uri: `https://pid.${environment.baseUrl}/e7870f05-2f63-479f-b00a-77139ab5e1a1/`,
          edge: `https://pid.${environment.baseUrl}/kos/19050/225896`
        }
      ],
      inbound: []
    };

    const mockChanges: SimpleChanges = {
      source: new SimpleChange(undefined, mockSource, true)
    };

    component.ngOnChanges(mockChanges);

    expect(component.showUnlinkButton).toBeTrue();
  });

  it('should unlink this resource from another resource', () => {
    const mockSource = {} as DocumentMap;
    mockSource[`https://pid.${environment.baseUrl}/kos/19050/hasVersions`] = {
      outbound: [
        {
          value: `https://pid.${environment.baseUrl}/kos/19050#b7611e3f-9854-45f7-8b34-04a00379cd5f`,
          uri: `https://pid.${environment.baseUrl}/e7870f05-2f63-479f-b00a-77139ab5e1a1/`,
          edge: `https://pid.${environment.baseUrl}/kos/19050/225896`
        }
      ],
      inbound: []
    };

    const mockChanges: SimpleChanges = {
      pidUri: new SimpleChange(undefined, mockUnsanitizedUri, true),
      source: new SimpleChange(undefined, mockSource, true)
    };

    const mockUnlinkResourceAction = new UnlinkResource(mockUnsanitizedUri);

    const spyOnDispatch = spyOn(component['store'], 'dispatch').and.returnValue(
      of(true)
    );

    component.ngOnChanges(mockChanges);
    component.unlinkResource();

    expect(spyOnDispatch).toHaveBeenCalledWith(mockUnlinkResourceAction);
  });

  it('should show link button if no new version is available');

  it('should open window to create new version of resource', () => {
    const mockChanges: SimpleChanges = {
      pidUri: new SimpleChange(undefined, mockUnsanitizedUri, true),
      entityType: new SimpleChange(undefined, mockEntityType, true)
    };

    const spyOnWindow = spyOn(window, 'open').and.stub();

    component.ngOnChanges(mockChanges);
    component.createNewVersion();

    expect(spyOnWindow).toHaveBeenCalledWith(
      `${environment.pidUrl}resource/new` +
        `?type=${mockEntityType}` +
        `&based=${mockSanitizedUri}` +
        `&creationType=${ResourceCreationType.NEWVERSION}`,
      '_blank'
    );
  });

  it('should open window to copy resource', () => {
    const mockChanges: SimpleChanges = {
      pidUri: new SimpleChange(undefined, mockUnsanitizedUri, true),
      entityType: new SimpleChange(undefined, mockEntityType, true)
    };

    const spyOnWindow = spyOn(window, 'open').and.stub();

    component.ngOnChanges(mockChanges);
    component.copyResource();

    expect(spyOnWindow).toHaveBeenCalledWith(
      `${environment.pidUrl}resource/new` +
        `?type=${mockEntityType}` +
        `&based=${mockSanitizedUri}` +
        `&creationType=${ResourceCreationType.COPY}`,
      '_blank'
    );
  });

  it('should disable subscription button when resource has draft version');

  it("should show subscribe button when user isn't subscribed already", () => {
    const mockChanges: SimpleChanges = {
      pidUri: new SimpleChange(undefined, mockSanitizedUri, true),
      colidEntrySubscriptions: new SimpleChange(undefined, [], true)
    };

    component.ngOnChanges(mockChanges);

    expect(component.isSubscribed).toBeFalse();
    expect(component.subscriptionButtonIcon).toEqual('notifications_none');
    expect(component.subscriptionButtonTooltip).toEqual(
      'Subscribe to resource'
    );
  });

  it('should show unsubscribe button when user is already subscribed', () => {
    const mockChanges: SimpleChanges = {
      pidUri: new SimpleChange(undefined, mockSanitizedUri, true),
      colidEntrySubscriptions: new SimpleChange(
        undefined,
        [{ colidPidUri: mockSanitizedUri }],
        true
      )
    };

    component.ngOnChanges(mockChanges);

    expect(component.isSubscribed).toBeTrue();
    expect(component.subscriptionButtonIcon).toEqual('notifications_active');
    expect(component.subscriptionButtonTooltip).toEqual(
      'Unsubscribe from resource'
    );
  });

  it('should subscribe to resource', () => {
    const mockChanges: SimpleChanges = {
      pidUri: new SimpleChange(undefined, mockSanitizedUri, true),
      colidEntrySubscriptions: new SimpleChange(undefined, [], true)
    };

    const mockAction: AddColidEntrySubscription = new AddColidEntrySubscription(
      new ColidEntrySubscriptionDto(mockSanitizedUri)
    );

    const spyOnDispatch = spyOn(
      component['store'],
      'dispatch'
    ).and.callThrough();

    component.ngOnChanges(mockChanges);
    component.handleSubscriptionButtonClick(mockEvent);

    expect(spyOnDispatch).toHaveBeenCalledWith(mockAction);
  });

  it('should unsubscribe from resource', () => {
    const mockChanges: SimpleChanges = {
      pidUri: new SimpleChange(undefined, mockSanitizedUri, true),
      colidEntrySubscriptions: new SimpleChange(
        undefined,
        [{ colidPidUri: mockSanitizedUri }],
        true
      )
    };

    const mockAction: RemoveColidEntrySubscription =
      new RemoveColidEntrySubscription(
        new ColidEntrySubscriptionDto(mockSanitizedUri)
      );

    const spyOnDispatch = spyOn(
      component['store'],
      'dispatch'
    ).and.callThrough();

    component.ngOnChanges(mockChanges);
    component.handleSubscriptionButtonClick(mockEvent);

    expect(spyOnDispatch).toHaveBeenCalledWith(mockAction);
  });

  it('should set flag when resource has a draft version', () => {
    const mockChanges: SimpleChanges = {
      entryLifeCycleStatus: new SimpleChange(
        undefined,
        Constants.Resource.LifeCycleStatus.Draft,
        true
      )
    };

    component.ngOnChanges(mockChanges);

    expect(component.hasDraftVersion).toBeTrue();
  });

  it(
    "should change favorite button's tooltip and icon when resource is favorited"
  );

  it('should open favorites management dialog on favorite button click', () => {
    const spyOnDialog = spyOn(component['dialog'], 'open').and.stub();

    component.openFavoritesDialog(mockEvent);

    expect(spyOnDialog).toHaveBeenCalled();
  });

  it('should disable Open in RRM button if resource has draft version');

  it('should open new RRM window and log metadata', () => {
    const mockUnsanitizedUri = '123/#abc';

    const mockChanges: SimpleChanges = {
      pidUri: new SimpleChange(undefined, mockUnsanitizedUri, true),
      searchText: new SimpleChange(undefined, 'text', true),
      searchTimestamp: new SimpleChange(undefined, 'timestamp', true)
    };

    const spyOnWindow = spyOn(window, 'open').and.stub();
    const spyOnLogger = spyOn(component['logger'], 'info').and.stub();

    component.ngOnChanges(mockChanges);
    component.openInResourceRelationshipManager(mockEvent);

    expect(spyOnWindow).toHaveBeenCalledWith(
      `${environment.rrmUrl}?baseNode=${mockSanitizedUri}`,
      '_blank'
    );

    expect(spyOnLogger).toHaveBeenCalledWith(
      'DMP_RESULT_PAGE_RESOURCE_RRM_CLICKED',
      {
        searchText: 'text',
        searchTimestamp: 'timestamp',
        resourcePIDUri: mockUnsanitizedUri
      }
    );
  });

  it('should only show favorites button if requested by input');

  it('should only show subscription button if requested by input');
});
