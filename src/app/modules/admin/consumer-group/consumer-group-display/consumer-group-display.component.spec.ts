import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerGroupDisplayComponent } from './consumer-group-display.component';
import { NgxsModule } from '@ngxs/store';
import { RouterModule } from '@angular/router';
import { MockColidSpinnerComponent } from 'src/app/shared/mocks/unit-test-mocks';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

describe('ConsumerGroupDisplayComponent', () => {
  let component: ConsumerGroupDisplayComponent;
  let fixture: ComponentFixture<ConsumerGroupDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsumerGroupDisplayComponent, MockColidSpinnerComponent],
      imports: [
        NgxsModule.forRoot(),
        RouterModule,
        MatButtonModule,
        MatIconModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsumerGroupDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
