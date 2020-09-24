import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionEndpointComponent } from './distribution-endpoint.component';

describe('DistributionEndpointComponent', () => {
  let component: DistributionEndpointComponent;
  let fixture: ComponentFixture<DistributionEndpointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributionEndpointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionEndpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
