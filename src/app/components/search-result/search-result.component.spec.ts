import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DetailsViewModel,
  DetailsViewModelNested,
  SearchResultComponent
} from './search-result.component';
import { LogService } from 'src/app/core/logging/log.service';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { NgxsModule } from '@ngxs/store';
import { MatIcon } from '@angular/material/icon';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatRadioButton } from '@angular/material/radio';
import { BypassSanitizerPipe } from 'src/app/shared/pipes/bypassSanitizer.pipe';
import {
  MockColidIconsComponent,
  MockResourceOperationsButtonsComponent,
  MockResourceStatusIndicatorsComponent,
  MockResourceQualityIndicatorsComponent,
  MockLogService,
  MockAuthService
} from 'src/app/shared/mocks/unit-test-mocks';

describe('SearchResultComponent', () => {
  let component: SearchResultComponent;
  let fixture: ComponentFixture<SearchResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchResultComponent,
        MockColidIconsComponent,
        MockResourceOperationsButtonsComponent,
        MockResourceStatusIndicatorsComponent,
        MockResourceQualityIndicatorsComponent,
        BypassSanitizerPipe
      ],
      imports: [
        NoopAnimationsModule,
        NgxsModule.forRoot(),
        MatIcon,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        MatAccordion,
        MatTab,
        MatTabGroup
      ],
      providers: [
        {
          provide: LogService,
          useClass: MockLogService
        },
        {
          provide: AuthService,
          useClass: MockAuthService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter resources by label', () => {
    const mockLinks: Array<DetailsViewModelNested> = [
      {
        // This one should be found by Label
        edge: 'https://pid.bayer.com/kos/19050/225896',
        id: 'https://pid.bayer.com/51100dd7-9ea2-437c-8a79-c82d7e81d1d5/',
        value: [
          {
            key: 'https://pid.bayer.com/kos/19050/hasLabel',
            value: ['test with label']
          } as DetailsViewModel,
          {
            key: 'https://pid.bayer.com/kos/19050/hasResourceDefinition',
            value: ['<p>Mock definition/p>']
          } as DetailsViewModel
        ]
      },
      {
        // This one should be found by Definition
        edge: 'https://pid.bayer.com/kos/19050/225896',
        id: 'https://pid.bayer.com/51100dd7-9ea2-437c-8a79-c82d7e81d1d5/',
        value: [
          {
            key: 'https://pid.bayer.com/kos/19050/hasLabel',
            value: ['Mock label']
          } as DetailsViewModel,
          {
            key: 'https://pid.bayer.com/kos/19050/hasResourceDefinition',
            value: ['<p>Test definition/p>']
          } as DetailsViewModel
        ]
      },
      {
        // This one should NOT be found
        edge: 'https://pid.bayer.com/kos/19050/225896',
        id: 'https://pid.bayer.com/51100dd7-9ea2-437c-8a79-c82d7e81d1d5/',
        value: [
          {
            key: 'https://pid.bayer.com/kos/19050/hasLabel',
            value: ['Mock label']
          } as DetailsViewModel,
          {
            key: 'https://pid.bayer.com/kos/19050/hasResourceDefinition',
            value: ['<p>Mock definition </p>']
          } as DetailsViewModel
        ]
      }
    ];

    const expectedLinks: Array<DetailsViewModelNested> = [
      {
        // This one should be found by Label
        edge: 'https://pid.bayer.com/kos/19050/225896',
        id: 'https://pid.bayer.com/51100dd7-9ea2-437c-8a79-c82d7e81d1d5/',
        value: [
          {
            key: 'https://pid.bayer.com/kos/19050/hasLabel',
            value: ['test with label']
          } as DetailsViewModel,
          {
            key: 'https://pid.bayer.com/kos/19050/hasResourceDefinition',
            value: ['<p>Mock definition/p>']
          } as DetailsViewModel
        ]
      },
      {
        // This one should be found by Definition
        edge: 'https://pid.bayer.com/kos/19050/225896',
        id: 'https://pid.bayer.com/51100dd7-9ea2-437c-8a79-c82d7e81d1d5/',
        value: [
          {
            key: 'https://pid.bayer.com/kos/19050/hasLabel',
            value: ['Mock label']
          } as DetailsViewModel,
          {
            key: 'https://pid.bayer.com/kos/19050/hasResourceDefinition',
            value: ['<p>Test definition/p>']
          } as DetailsViewModel
        ]
      }
    ];

    const result = component.filterLinks(
      mockLinks,
      [
        'https://pid.bayer.com/kos/19050/hasLabel',
        'https://pid.bayer.com/kos/19050/hasResourceDefinition'
      ],
      'test'
    );

    expect(result).toEqual(expectedLinks);
    expect(result.length).toBe(2);
  });

  it('should apply nested links filters', () => {
    const mockOutboundLinks: Array<DetailsViewModelNested> = [
      {
        // This one should be found by Label
        edge: 'https://pid.bayer.com/kos/19050/225896',
        id: 'https://pid.bayer.com/51100dd7-9ea2-437c-8a79-c82d7e81d1d5/',
        value: [
          {
            key: 'https://pid.bayer.com/kos/19050/hasLabel',
            value: ['test with label']
          } as DetailsViewModel,
          {
            key: 'https://pid.bayer.com/kos/19050/hasResourceDefinition',
            value: ['<p>Mock definition/p>']
          } as DetailsViewModel
        ]
      },
      {
        // This one should NOT be found
        edge: 'https://pid.bayer.com/kos/19050/225896',
        id: 'https://pid.bayer.com/51100dd7-9ea2-437c-8a79-c82d7e81d1d5/',
        value: [
          {
            key: 'https://pid.bayer.com/kos/19050/hasLabel',
            value: ['Mock label']
          } as DetailsViewModel,
          {
            key: 'https://pid.bayer.com/kos/19050/hasResourceDefinition',
            value: ['<p>Mock definition with addition</p>']
          } as DetailsViewModel
        ]
      }
    ];

    const expectedOutboundLinks: Array<DetailsViewModelNested> = [
      {
        // This one should be found by Label
        edge: 'https://pid.bayer.com/kos/19050/225896',
        id: 'https://pid.bayer.com/51100dd7-9ea2-437c-8a79-c82d7e81d1d5/',
        value: [
          {
            key: 'https://pid.bayer.com/kos/19050/hasLabel',
            value: ['test with label']
          } as DetailsViewModel,
          {
            key: 'https://pid.bayer.com/kos/19050/hasResourceDefinition',
            value: ['<p>Mock definition/p>']
          } as DetailsViewModel
        ]
      }
    ];

    const mockInboundLinks: Array<DetailsViewModelNested> = [
      {
        // This one should be found by Definition
        edge: 'https://pid.bayer.com/kos/19050/225896',
        id: 'https://pid.bayer.com/51100dd7-9ea2-437c-8a79-c82d7e81d1d5/',
        value: [
          {
            key: 'https://pid.bayer.com/kos/19050/hasLabel',
            value: ['Mock label']
          } as DetailsViewModel,
          {
            key: 'https://pid.bayer.com/kos/19050/hasResourceDefinition',
            value: ['<p>Test definition</p>']
          } as DetailsViewModel
        ]
      },
      {
        // This one should NOT be found
        edge: 'https://pid.bayer.com/kos/19050/225896',
        id: 'https://pid.bayer.com/51100dd7-9ea2-437c-8a79-c82d7e81d1d5/',
        value: [
          {
            key: 'https://pid.bayer.com/kos/19050/hasLabel',
            value: ['Mock label']
          } as DetailsViewModel,
          {
            key: 'https://pid.bayer.com/kos/19050/hasResourceDefinition',
            value: ['<p>Mock definition with addition</p>']
          } as DetailsViewModel
        ]
      }
    ];

    const expectedInboundLinks: Array<DetailsViewModelNested> = [
      {
        // This one should be found by Definition
        edge: 'https://pid.bayer.com/kos/19050/225896',
        id: 'https://pid.bayer.com/51100dd7-9ea2-437c-8a79-c82d7e81d1d5/',
        value: [
          {
            key: 'https://pid.bayer.com/kos/19050/hasLabel',
            value: ['Mock label']
          } as DetailsViewModel,
          {
            key: 'https://pid.bayer.com/kos/19050/hasResourceDefinition',
            value: ['<p>Test definition</p>']
          } as DetailsViewModel
        ]
      }
    ];

    component.allOutboundNestedLinks = mockOutboundLinks;
    component.allInboundNestedLinks = mockInboundLinks;

    component.nestedLinksFilterValue = 'test';
    component.applyNestedLinksFilter();

    expect(component.filteredOutboundNestedLinks).toEqual(
      expectedOutboundLinks
    );
    expect(component.filteredInboundNestedLinks).toEqual(expectedInboundLinks);
  });

  it('should show nested links depending on filter selection', () => {
    component.nestedLinksVisibilityValue = 'all';

    component.setNestedLinksVisibility({
      value: 'outbound',
      source: {} as MatRadioButton
    });

    expect(component.showOutboundNestedLinks).toBeTrue();
    expect(component.showInboundNestedLinks).toBeFalse();

    component.setNestedLinksVisibility({
      value: 'inbound',
      source: {} as MatRadioButton
    });

    expect(component.showOutboundNestedLinks).toBeFalse();
    expect(component.showInboundNestedLinks).toBeTrue();

    component.setNestedLinksVisibility({
      value: 'all',
      source: {} as MatRadioButton
    });

    expect(component.showOutboundNestedLinks).toBeTrue();
    expect(component.showInboundNestedLinks).toBeTrue();
  });

  it('should show review cycle expired quality indicator', () => {
    const mockDetails: Array<DetailsViewModel> = [
      {
        key: 'https://pid.bayer.com/kos/19050/hasNextReviewDueDate',
        value: ['3000-01-01T01:01:01Z'] // If this test is red... you are still using this software in the year 3000?!
      } as DetailsViewModel
    ];

    component.details = mockDetails;

    component['setReviewDateQualityIndicators']();

    expect(component.nextReviewIsDue).toBeFalse();
  });

  it('should show review cycle valid quality indicator', () => {
    const mockDetails: Array<DetailsViewModel> = [
      {
        key: 'https://pid.bayer.com/kos/19050/hasNextReviewDueDate',
        value: ['2000-01-01T01:01:01Z'] // If this test is red, time travel has been invented - welcome to the past!
      } as DetailsViewModel
    ];

    component.details = mockDetails;

    component['setReviewDateQualityIndicators']();

    expect(component.nextReviewIsDue).toBeTrue();
  });

  it('should show broken contacts quality indicators', () => {
    const expectedBrokenContacts = ['Mock person 1', 'Mock person 2'];

    const mockDetails: Array<DetailsViewModel> = [
      {
        key: 'https://pid.bayer.com/kos/19050/hasBrokenDataSteward',
        value: ['Mock person 1', 'Mock person 2']
      } as DetailsViewModel
    ];

    component.details = mockDetails;

    component['setBrokenContactsAndEndpointsQualityIndicators']();

    expect(component.brokenContacts).toEqual(expectedBrokenContacts);
  });

  it('should show broken distribution endpoints quality indicators', () => {
    const expectedBrokenEndpoints = [
      'Mock broken endpoint 1',
      'Mock broken endpoint 2'
    ];

    const mockDetails: Array<DetailsViewModel> = [
      {
        key: 'https://pid.bayer.com/kos/19050/distribution',
        value: [
          {
            'https://pid.bayer.com/kos/19050/hasNetworkedResourceLabel': {
              outbound: [
                {
                  value: 'Mock broken endpoint 1',
                  uri: null,
                  edge: null
                }
              ],
              inbound: []
            },
            'https://pid.bayer.com/kos/19050/hasEndpointURLStatus': {
              outbound: [
                {
                  value: 'Broken',
                  uri: null,
                  edge: null
                }
              ],
              inbound: []
            }
          },
          {
            'https://pid.bayer.com/kos/19050/hasNetworkedResourceLabel': {
              outbound: [
                {
                  value: 'Mock broken endpoint 2',
                  uri: null,
                  edge: null
                }
              ],
              inbound: []
            },
            'https://pid.bayer.com/kos/19050/hasEndpointURLStatus': {
              outbound: [
                {
                  value: 'Broken',
                  uri: null,
                  edge: null
                }
              ],
              inbound: []
            }
          }
        ]
      } as DetailsViewModel
    ];

    component.details = mockDetails;

    component['setBrokenContactsAndEndpointsQualityIndicators']();

    expect(component.brokenDistributionEndpoints).toEqual(
      expectedBrokenEndpoints
    );
  });

  it('should show broken contacts quality indicators for distribution links', () => {
    const expectedBrokenContacts = ['Mock person 1', 'Mock person 2'];

    const mockDetails: Array<DetailsViewModel> = [
      {
        key: 'https://pid.bayer.com/kos/19050/distribution',
        value: [
          {
            'https://pid.bayer.com/kos/19050/hasBrokenEndpointContact': {
              outbound: [
                {
                  value: 'Mock person 1',
                  uri: null,
                  edge: null
                }
              ],
              inbound: []
            }
          },
          {
            'https://pid.bayer.com/kos/19050/hasBrokenEndpointContact': {
              outbound: [
                {
                  value: 'Mock person 2',
                  uri: null,
                  edge: null
                }
              ],
              inbound: []
            }
          }
        ]
      } as DetailsViewModel
    ];

    component.details = mockDetails;

    component['setBrokenContactsAndEndpointsQualityIndicators']();

    expect(component.brokenContacts).toEqual(expectedBrokenContacts);
  });
});
