import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserSupportComponent } from './ensure-browser-support.component';
import { EnsureBrowserSupportService } from '../services/ensure-browser-support.service';
import { CommonModule } from '@angular/common';
import { MockEnsureBrowserSupportService } from 'src/app/shared/mocks/unit-test-mocks';

describe('BrowserSupportComponent', () => {
  let component: BrowserSupportComponent;
  let fixture: ComponentFixture<BrowserSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrowserSupportComponent],
      imports: [CommonModule],
      providers: [
        {
          provide: EnsureBrowserSupportService,
          useClass: MockEnsureBrowserSupportService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BrowserSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set supportedBrowser to true if the browser is supported', () => {
    spyOn(
      component['ensureBrowserSupportService'],
      'isSupported'
    ).and.returnValue(true);

    component.ngOnInit();

    expect(component.supportedBrowser).toBeTrue();
  });

  it('should set supportedBrowser to false if the browser is not supported', () => {
    spyOn(
      component['ensureBrowserSupportService'],
      'isSupported'
    ).and.returnValue(false);

    component.ngOnInit();

    expect(component.supportedBrowser).toBeFalse();
  });
});
