import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkHistoryViewComponent } from './link-history-view.component';
import { MetadataService } from 'src/app/core/http/metadata.service';
import { ResourceApiService } from 'src/app/core/http/resource.api.service';
import { UserInfoApiService } from 'src/app/core/http/user-info.api.service';
import {
  MockLinkHistoryComponent,
  MockMetadataService,
  MockResourceApiService,
  MockUserInfoApiService
} from 'src/app/shared/mocks/unit-test-mocks';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatHint } from '@angular/material/form-field';
import {
  MatDatepickerModule,
  MatDateRangeInput
} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatOptionModule
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DATE_FORMAT } from 'src/app/shared/components/form-item/form-item-input/form-item-input-datetime/form-item-input-datetime.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LinkHistoryViewComponent', () => {
  let component: LinkHistoryViewComponent;
  let fixture: ComponentFixture<LinkHistoryViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkHistoryViewComponent, MockLinkHistoryComponent],
      imports: [
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatDateRangeInput,
        MatInputModule,
        MatHint,
        MatDatepickerModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatOptionModule
      ],
      providers: [
        { provide: UserInfoApiService, useClass: MockUserInfoApiService },
        { provide: ResourceApiService, useClass: MockResourceApiService },
        { provide: MetadataService, useClass: MockMetadataService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LinkHistoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
