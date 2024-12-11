import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityHistoricComponent } from './entity-historic.component';
import { MockColidSpinnerComponent } from '../../mocks/unit-test-mocks';

describe('EntityHistoricComponent', () => {
  let component: EntityHistoricComponent;
  let fixture: ComponentFixture<EntityHistoricComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntityHistoricComponent, MockColidSpinnerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EntityHistoricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
