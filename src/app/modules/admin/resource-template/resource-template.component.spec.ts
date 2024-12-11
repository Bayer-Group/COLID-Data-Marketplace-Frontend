import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceTemplateComponent } from './resource-template.component';
import { NgxsModule } from '@ngxs/store';
import {
  MockActionButtonComponent,
  MockColidSpinnerComponent
} from 'src/app/shared/mocks/unit-test-mocks';

describe('ResourceTemplateComponent', () => {
  let component: ResourceTemplateComponent;
  let fixture: ComponentFixture<ResourceTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ResourceTemplateComponent,
        MockColidSpinnerComponent,
        MockActionButtonComponent
      ],
      imports: [NgxsModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
