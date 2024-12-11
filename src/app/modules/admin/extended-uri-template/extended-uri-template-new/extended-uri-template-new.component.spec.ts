import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExtendedUriTemplateNewComponent } from './extended-uri-template-new.component';

// TODO: Remove this component - go directly to app-extended-uri-template-form
xdescribe('ExtendedUriTemplateNewComponent', () => {
  let component: ExtendedUriTemplateNewComponent;
  let fixture: ComponentFixture<ExtendedUriTemplateNewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExtendedUriTemplateNewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedUriTemplateNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
