import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputTaxonomyComponent } from './form-item-input-taxonomy.component';
import { NgxsModule } from '@ngxs/store';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MockColidTreeViewComponent } from 'src/app/shared/mocks/unit-test-mocks';

describe('FormItemInputTaxonomyComponent', () => {
  let component: FormItemInputTaxonomyComponent;
  let fixture: ComponentFixture<FormItemInputTaxonomyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormItemInputTaxonomyComponent,
        MockColidTreeViewComponent
      ],
      imports: [NgxsModule.forRoot([]), MatIconModule, MatButtonModule],
      providers: [
        {
          provide: MatDialog,
          useValue: {}
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormItemInputTaxonomyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
