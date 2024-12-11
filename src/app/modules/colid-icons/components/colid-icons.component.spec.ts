import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColidIconsComponent } from './colid-icons.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

// TODO: Unify - duplicate code with colid-ui-editor-frontend
describe('ColidIconsComponent', () => {
  let component: ColidIconsComponent;
  let fixture: ComponentFixture<ColidIconsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ColidIconsComponent],
      imports: [MatIconModule, MatTooltipModule, FontAwesomeTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ColidIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
