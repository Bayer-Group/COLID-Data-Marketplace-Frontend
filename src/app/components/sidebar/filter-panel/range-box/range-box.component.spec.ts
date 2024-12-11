import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeBoxComponent } from './range-box.component';
import { NgxsModule } from '@ngxs/store';
import { MockFilterBoxItemDaterangeComponent } from 'src/app/shared/mocks/unit-test-mocks';

describe('RangeBoxComponent', () => {
  let component: RangeBoxComponent;
  let fixture: ComponentFixture<RangeBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RangeBoxComponent, MockFilterBoxItemDaterangeComponent],
      imports: [NgxsModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RangeBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
