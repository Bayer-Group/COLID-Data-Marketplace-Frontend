import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityFormComponent } from './entity-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockColidSpinnerComponent } from '../../mocks/unit-test-mocks';

describe('EntityFormComponent', () => {
  let component: EntityFormComponent;
  let fixture: ComponentFixture<EntityFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntityFormComponent, MockColidSpinnerComponent],
      imports: [MatDialogModule, FormsModule, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EntityFormComponent);
    component = fixture.componentInstance;

    component.metaData = [];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
