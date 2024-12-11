import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceTemplateTableComponent } from './resource-template-table.component';
import { NgxsModule } from '@ngxs/store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { EntityFormService } from 'src/app/shared/services/entity-form.service';
import {
  MockColidMatSnackBarService,
  MockEntityFormService
} from 'src/app/shared/mocks/unit-test-mocks';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { MatPaginatorModule } from '@angular/material/paginator';

describe('ResourceTemplateTableComponent', () => {
  let component: ResourceTemplateTableComponent;
  let fixture: ComponentFixture<ResourceTemplateTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceTemplateTableComponent],
      imports: [
        NgxsModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatPaginatorModule
      ],
      providers: [
        { provide: EntityFormService, useClass: MockEntityFormService },
        {
          provide: ColidMatSnackBarService,
          useClass: MockColidMatSnackBarService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceTemplateTableComponent);
    component = fixture.componentInstance;

    component.metaData = [];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
