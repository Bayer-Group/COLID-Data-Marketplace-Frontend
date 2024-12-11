import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PidUriTemplateComponent } from './pid-uri-template.component';
import { NgxsModule } from '@ngxs/store';
import {
  MockActionButtonComponent,
  MockPidUriTemplateTableComponent
} from 'src/app/shared/mocks/unit-test-mocks';

describe('PidUriTemplateComponent', () => {
  let component: PidUriTemplateComponent;
  let fixture: ComponentFixture<PidUriTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PidUriTemplateComponent,
        MockActionButtonComponent,
        MockPidUriTemplateTableComponent
      ],
      imports: [NgxsModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PidUriTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
