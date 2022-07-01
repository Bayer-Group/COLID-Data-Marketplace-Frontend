import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcePoliciesComponent } from './resource-policies.component';

describe('ResourcePoliciesComponent', () => {
  let component: ResourcePoliciesComponent;
  let fixture: ComponentFixture<ResourcePoliciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourcePoliciesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcePoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
