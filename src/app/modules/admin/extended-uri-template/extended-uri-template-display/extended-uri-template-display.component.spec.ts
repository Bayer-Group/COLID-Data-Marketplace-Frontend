import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedUriTemplateDisplayComponent } from './extended-uri-template-display.component';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MockColidSpinnerComponent } from 'src/app/shared/mocks/unit-test-mocks';

describe('ExtendedUriTemplateDisplayComponent', () => {
  let component: ExtendedUriTemplateDisplayComponent;
  let fixture: ComponentFixture<ExtendedUriTemplateDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExtendedUriTemplateDisplayComponent,
        MockColidSpinnerComponent
      ],
      imports: [
        RouterModule,
        NgxsModule.forRoot(),
        MatIconModule,
        MatButtonModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExtendedUriTemplateDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
