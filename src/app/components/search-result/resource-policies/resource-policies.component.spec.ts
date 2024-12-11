import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcePoliciesComponent } from './resource-policies.component';
import { NgxsModule } from '@ngxs/store';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

describe('ResourcePoliciesComponent', () => {
  let component: ResourcePoliciesComponent;
  let fixture: ComponentFixture<ResourcePoliciesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourcePoliciesComponent],
      imports: [
        NgxsModule.forRoot(),
        MatDialogModule,
        MatIconModule,
        MatButtonModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourcePoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
