import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RemoveFavoriteEntryComponent } from './remove-favorite-entry.component';
import { MockMatDialogRef } from 'src/app/shared/mocks/unit-test-mocks';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

describe('RemoveFavoriteEntryComponent', () => {
  let component: RemoveFavoriteEntryComponent;
  let fixture: ComponentFixture<RemoveFavoriteEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemoveFavoriteEntryComponent],
      imports: [MatDialogModule, MatButtonModule],
      providers: [{ provide: MatDialogRef, useClass: MockMatDialogRef }]
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveFavoriteEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
