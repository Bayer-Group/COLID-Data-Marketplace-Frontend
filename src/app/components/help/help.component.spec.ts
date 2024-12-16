import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpComponent } from './help.component';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { environment } from 'src/environments/environment';

describe('HelpComponent', () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpComponent],
      imports: [MatDialogModule, MatIconModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open feedback mail link when sendFeedbackMail is called', () => {
    spyOn(window, 'open');

    component.sendFeedbackMail();

    expect(window.open).toHaveBeenCalledWith(
      environment.appSupportFeedBack.mailToLink
    );
  });

  it('should open support ticket link when createSupportTicket is called', () => {
    spyOn(window, 'open');

    component.createSupportTicket();

    expect(window.open).toHaveBeenCalledWith(
      environment.appSupportFeedBack.supportTicketLink
    );
  });
});
