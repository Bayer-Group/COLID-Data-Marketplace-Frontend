import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedUriTemplateEditComponent } from './extended-uri-template-edit.component';

// TODO: Remove this component - go directly to app-extend-uri-template-form
xdescribe('ExtendedUriTemplateEditComponent', () => {
  let component: ExtendedUriTemplateEditComponent;
  let fixture: ComponentFixture<ExtendedUriTemplateEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExtendedUriTemplateEditComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ExtendedUriTemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
