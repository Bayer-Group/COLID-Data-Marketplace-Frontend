import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestResourceChangesTileComponent } from './latest-resource-changes-tile.component';
import { NgxsModule } from '@ngxs/store';
import { SearchService } from 'src/app/core/http/search.service';
import {
  MockResourceItemTileComponent,
  MockSearchService
} from 'src/app/shared/mocks/unit-test-mocks';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LatestResourceChangesTileComponent', () => {
  let component: LatestResourceChangesTileComponent;
  let fixture: ComponentFixture<LatestResourceChangesTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LatestResourceChangesTileComponent,
        MockResourceItemTileComponent
      ],
      imports: [
        NoopAnimationsModule,
        NgxsModule.forRoot(),
        MatExpansionModule,
        MatListModule,
        MatProgressSpinnerModule,
        InfiniteScrollDirective
      ],
      providers: [{ provide: SearchService, useClass: MockSearchService }]
    }).compileComponents();

    fixture = TestBed.createComponent(LatestResourceChangesTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
