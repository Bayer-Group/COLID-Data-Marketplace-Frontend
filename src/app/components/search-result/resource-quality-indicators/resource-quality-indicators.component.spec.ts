import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceQualityIndicatorsComponent } from './resource-quality-indicators.component';

describe('ResourceQualityIndicatorsComponent', () => {
  let component: ResourceQualityIndicatorsComponent;
  let fixture: ComponentFixture<ResourceQualityIndicatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceQualityIndicatorsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceQualityIndicatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show broken distribution endpoints', () => {
    component.brokenDistributionEndpoints = ['endpoint1', 'endpoint2'];
    expect(component.showBrokenDistributionEndpoints).toBeTrue();

    component.brokenDistributionEndpoints = [];
    expect(component.showBrokenDistributionEndpoints).toBeFalse();
  });

  it('should show broken contacts', () => {
    component.brokenContacts = ['contact1', 'contact2'];
    expect(component.showBrokenContacts).toBeTrue();

    component.brokenContacts = [];
    expect(component.showBrokenContacts).toBeFalse();
  });

  it('should show next review is due', () => {
    component.nextReviewIsDue = true;
    expect(component.showNextReviewIsDue).toBeTrue();

    component.nextReviewIsDue = false;
    expect(component.showNextReviewIsDue).toBeFalse();

    component.nextReviewIsDue = null;
    expect(component.showNextReviewIsDue).toBeFalse();

    component.nextReviewIsDue = undefined;
    expect(component.showNextReviewIsDue).toBeFalse();
  });

  it('should show valid review cycle', () => {
    component.nextReviewIsDue = false;
    expect(component.showValidReviewCycle).toBeTrue();

    component.nextReviewIsDue = true;
    expect(component.showValidReviewCycle).toBeFalse();

    component.nextReviewIsDue = null;
    expect(component.showValidReviewCycle).toBeFalse();

    component.nextReviewIsDue = undefined;
    expect(component.showValidReviewCycle).toBeFalse();
  });
});
