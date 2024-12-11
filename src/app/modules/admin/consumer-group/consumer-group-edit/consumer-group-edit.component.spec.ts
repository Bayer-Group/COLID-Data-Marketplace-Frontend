import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerGroupEditComponent } from './consumer-group-edit.component';
import { NgxsModule } from '@ngxs/store';

// TODO: remove this component and call app-consumer-group-form directly!
xdescribe('ConsumerGroupEditComponent', () => {
  let component: ConsumerGroupEditComponent;
  let fixture: ComponentFixture<ConsumerGroupEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsumerGroupEditComponent],
      imports: [NgxsModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsumerGroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
