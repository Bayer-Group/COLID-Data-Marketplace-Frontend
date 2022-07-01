import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ColidSpinnerComponent } from './colid-spinner.component';

describe('ColidSpinnerComponent', () => {
  let component: ColidSpinnerComponent;
  let fixture: ComponentFixture<ColidSpinnerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ColidSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColidSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
