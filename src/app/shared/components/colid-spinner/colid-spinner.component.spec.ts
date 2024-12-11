import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColidSpinnerComponent } from './colid-spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('ColidSpinnerComponent', () => {
  let component: ColidSpinnerComponent;
  let fixture: ComponentFixture<ColidSpinnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ColidSpinnerComponent],
      imports: [MatProgressSpinnerModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ColidSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
