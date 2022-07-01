import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SimilarityModalComponent } from './similarity-modal.component';

describe('SimilarityModalComponent', () => {
  let component: SimilarityModalComponent;
  let fixture: ComponentFixture<SimilarityModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SimilarityModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimilarityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
