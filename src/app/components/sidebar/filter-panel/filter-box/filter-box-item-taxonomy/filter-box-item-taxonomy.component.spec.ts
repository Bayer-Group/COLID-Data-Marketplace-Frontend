import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBoxItemTaxonomyComponent } from './filter-box-item-taxonomy.component';
import { NgxsModule } from '@ngxs/store';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// TODO: "Error: Could not find a tree control for the tree." - needs analysis
xdescribe('FilterBoxItemTaxonomyComponent', () => {
  let component: FilterBoxItemTaxonomyComponent;
  let fixture: ComponentFixture<FilterBoxItemTaxonomyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterBoxItemTaxonomyComponent],
      imports: [
        NgxsModule.forRoot(),
        MatTreeModule,
        MatCheckboxModule,
        MatIconModule,
        MatButtonModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterBoxItemTaxonomyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
