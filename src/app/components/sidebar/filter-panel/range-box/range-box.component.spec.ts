import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeBoxComponent } from './range-box.component';

describe('RangeBoxComponent', () => {
  let component: RangeBoxComponent;
  let fixture: ComponentFixture<RangeBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
