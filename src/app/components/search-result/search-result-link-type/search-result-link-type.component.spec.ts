import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultLinkTypeComponent } from './search-result-link-type.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxsModule } from '@ngxs/store';
import {
  MockColidIconsComponent,
  MockLogService
} from 'src/app/shared/mocks/unit-test-mocks';
import { LogService } from 'src/app/core/logging/log.service';

// TODO: needs proper data mocks
xdescribe('SearchResultLinkTypeComponent', () => {
  let component: SearchResultLinkTypeComponent;
  let fixture: ComponentFixture<SearchResultLinkTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchResultLinkTypeComponent, MockColidIconsComponent],
      imports: [MatDialogModule, NgxsModule.forRoot()],
      providers: [{ provide: LogService, useClass: MockLogService }]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultLinkTypeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
