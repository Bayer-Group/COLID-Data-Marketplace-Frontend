import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResourceSubscriptionsComponent } from './resource-subscriptions.component';

describe('ResourceSubscriptionsComponent', () => {
  let component: ResourceSubscriptionsComponent;
  let fixture: ComponentFixture<ResourceSubscriptionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceSubscriptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
