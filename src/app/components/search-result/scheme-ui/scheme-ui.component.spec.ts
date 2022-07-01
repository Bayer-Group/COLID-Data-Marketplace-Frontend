import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeUIComponent } from './scheme-ui.component';

describe('SchemeUIComponent', () => {
  let component: SchemeUIComponent;
  let fixture: ComponentFixture<SchemeUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
