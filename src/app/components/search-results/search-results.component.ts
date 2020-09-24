import { Component, OnInit, EventEmitter, Output, ViewChild, NgZone, ElementRef } from '@angular/core';
import { SearchResult } from 'src/app/shared/models/search-result';
import { Select, Store } from '@ngxs/store';
import { SearchState, ChangeSearchText, FetchNextSearchResult } from '../../states/search.state';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FetchMetadata, MetadataState } from 'src/app/states/metadata.state';
import { ErrorCode } from 'src/app/shared/models/dmp-exception';
import { map } from 'rxjs/operators';
import { LogService } from 'src/app/core/logging/log.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  @Select(SearchState.getSearchResult) searchResult$: Observable<SearchResult>;
  @Select(SearchState.getSearchText) searchTextObservable$: Observable<string>;
  @Select(SearchState.getCorrectedSearchText) correctedSearchText$: Observable<string>;
  @Select(SearchState.getDidYouMean) didYouMean$: Observable<string>;
  @Select(SearchState.getPage) page$: Observable<number>;
  @Select(SearchState.getSearching) searching$: Observable<boolean>;
  @Select(MetadataState.getMetadata) metadata$: Observable<any>;
  @Select(SearchState.getErrorCode) errorCode$: Observable<ErrorCode>;

  isInvalidSearchQuery: Observable<boolean> = this.errorCode$.pipe(map(e => e === ErrorCode.INVALID_SEARCH_TERM));
  currentPage = 1;
  itemsPerPage = environment.pageSize;
  searchResult: SearchResult;
  didYouMean: string = null;
  metadata: any = null;
  loadingBatch = false;

  @ViewChild('searchResults', { static: false }) searchResults: ElementRef;

  @Output() changePage = new EventEmitter<number>();

  constructor(private store: Store, private logger: LogService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    console.log("app-search-results ngOnInit");

    this.store.dispatch(new FetchMetadata()).subscribe();
    this.logger.info("DMP_RESULT_PAGE_OPENED");

    this.metadata$.subscribe(met => {
      this.metadata = met;
    });

    this.searchResult$.subscribe(s => {
      this.searchResult = s;
      this.setDidYouMean(s);
      this.loadingBatch = false;

      setTimeout(()=> {
        if (this.searchResult != null && this.searchResults != null && this.searchResults.nativeElement.scrollHeight <= this.searchResults.nativeElement.offsetHeight){
          this.nextBatch(null, this.searchResult.hits.total )
        }
      }, 100)
    });
  }

  pageChanged(page: any) {
    console.log("app-search-results pageChanged");

    this.changePage.emit(page.page);
  }

  setDidYouMean(searchResult: SearchResult) {
    console.log("app-search-results setDidYouMean");

    try {
      const firstSuggest = Object.values(searchResult.suggest)[0][0];
      if (firstSuggest && firstSuggest.options && firstSuggest.options.length) {
        this.didYouMean = firstSuggest.options[0].text;
      }
    } catch {
      this.didYouMean = null;
    }
  }

  nextBatch(currIndex: number, maxRecordCount: number) {
    console.log("app-search-results nextBatch");

    if (this.loadingBatch) return;

    if (this.searchResult.hits.hits.length >= maxRecordCount) return;

    this.loadingBatch = true;
    this.store.dispatch(new FetchNextSearchResult(this.route)).subscribe();
  }

  acceptDidYouMean(dym: string) {
    console.log("app-search-results acceptDidYouMean");

    this.store.dispatch(new ChangeSearchText(dym, false)).subscribe();
  }
}
