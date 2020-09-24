import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeContentComponent } from './welcome-content.component';

describe('WelcomeContentComponent', () => {
  let component: WelcomeContentComponent;
  let fixture: ComponentFixture<WelcomeContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
