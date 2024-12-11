import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedUriTemplateComponent } from './extended-uri-template.component';
import { NgxsModule } from '@ngxs/store';
import { RouterModule } from '@angular/router';

describe('ExtendedUriTemplateComponent', () => {
  let component: ExtendedUriTemplateComponent;
  let fixture: ComponentFixture<ExtendedUriTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExtendedUriTemplateComponent],
      imports: [NgxsModule.forRoot(), RouterModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ExtendedUriTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
