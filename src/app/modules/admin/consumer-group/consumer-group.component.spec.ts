import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConsumerGroupComponent } from './consumer-group.component';
import { NgxsModule } from '@ngxs/store';
import { RouterModule } from '@angular/router';
import { MockColidSpinnerComponent } from 'src/app/shared/mocks/unit-test-mocks';

describe('ConsumerGroupComponent', () => {
  let component: ConsumerGroupComponent;
  let fixture: ComponentFixture<ConsumerGroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConsumerGroupComponent, MockColidSpinnerComponent],
      imports: [NgxsModule.forRoot(), RouterModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
