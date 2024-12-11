import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormItemCreateAttachmentComponent } from './form-item-create-attachment.component';

describe('FormItemCreateAttachmentComponent', () => {
  let component: FormItemCreateAttachmentComponent;
  let fixture: ComponentFixture<FormItemCreateAttachmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemCreateAttachmentComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemCreateAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
