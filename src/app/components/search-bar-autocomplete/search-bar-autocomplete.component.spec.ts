import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBarAutocompleteComponent } from './search-bar-autocomplete.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { MockSearchBarComponent } from 'src/app/shared/mocks/unit-test-mocks';

describe('SearchBarAutocompleteComponent', () => {
  let component: SearchBarAutocompleteComponent;
  let fixture: ComponentFixture<SearchBarAutocompleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchBarAutocompleteComponent, MockSearchBarComponent],
      imports: [NoopAnimationsModule, NgxsModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarAutocompleteComponent);
    component = fixture.componentInstance;

    component.initialSearchText = 'test';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
