import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedUriTemplateFormComponent } from './extended-uri-template-form.component';
import { NgxsModule } from '@ngxs/store';
import {
  mockActivatedRoute,
  MockColidMatSnackBarService
} from 'src/app/shared/mocks/unit-test-mocks';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';

// TODO: needs proper route mocks
xdescribe('ExtendedUriTemplateFormComponent', () => {
  let component: ExtendedUriTemplateFormComponent;
  let fixture: ComponentFixture<ExtendedUriTemplateFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExtendedUriTemplateFormComponent],
      imports: [NgxsModule.forRoot(), RouterModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        {
          provide: ColidMatSnackBarService,
          useClass: MockColidMatSnackBarService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExtendedUriTemplateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
