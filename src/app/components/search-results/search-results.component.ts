import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef, Input } from '@angular/core';
import { SearchResult } from 'src/app/shared/models/search-result';
import { Select, Store } from '@ngxs/store';
import { SearchState, ChangeSearchText, FetchNextSearchResult, AddSelectedPIDURI, RemoveSelectedPIDURI, AddSelectedPIDURIs, ClearSelectedPIDURIs } from '../../states/search.state';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FetchMetadata, MetadataState } from 'src/app/states/metadata.state';
import { ErrorCode } from 'src/app/shared/models/dmp-exception';
import { map, tap } from 'rxjs/operators';
import { LogService } from 'src/app/core/logging/log.service';
import { ActivatedRoute } from '@angular/router';
import { RRMState } from 'src/app/states/rrm.state';
import { Constants } from 'src/app/shared/constants';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: "app-search-results",
  templateUrl: "./search-results.component.html",
  styleUrls: ["./search-results.component.scss"],
})
export class SearchResultsComponent implements OnInit {
  @Select(SearchState.getSearchResult) searchResult$: Observable<SearchResult>;
  @Select(SearchState.getSearchText) searchTextObservable$: Observable<string>;
  @Select(SearchState.getCorrectedSearchText)
  correctedSearchText$: Observable<string>;
  @Select(SearchState.getDidYouMean) didYouMean$: Observable<string>;
  @Select(SearchState.getPage) page$: Observable<number>;
  @Select(SearchState.getSearching) searching$: Observable<boolean>;
  @Select(SearchState.getSelectedPIDURIs) selectedPIDURIs$: Observable<string[]>;
  @Select(MetadataState.getMetadata) metadata$: Observable<any>;
  @Select(SearchState.getErrorCode) errorCode$: Observable<ErrorCode>;
  @Select(RRMState.getFromRRM) showCheckbox$: Observable<boolean>;
  @Select(RRMState.getFilterMode) filterMode$: Observable<boolean>;
  @Select(RRMState.getSourceDialog) sourceDialog$: Observable<string>;
  @Input() pidUrisSearchResult: string[];
  isInvalidSearchQuery: Observable<boolean>;
  currentPage = 1;
  itemsPerPage = environment.pageSize;
  searchResult: SearchResult;
  didYouMean: string = null;
  metadata: any = null;
  loadingBatch = false;
  skipResult = [];
  sourceDialog: string = "addResource";
  filterInfo = {
    filterMode: false,
    sourceDialog: "addResource",
  };
  showCheckbox: boolean = false;
  activeTablist: any[] = [];
  selection = new SelectionModel<any>(true, []);

  @ViewChild("searchResults", { static: false }) searchResults: ElementRef;

  @Output() changePage = new EventEmitter<number>();

  constructor(
    private store: Store,
    private logger: LogService,
    private route: ActivatedRoute
  ) {
    this.isInvalidSearchQuery = this.errorCode$.pipe(
      map((e) => e === ErrorCode.INVALID_SEARCH_TERM)
    );

    var state = JSON.parse(this.route.snapshot.queryParamMap.get("fromRRM"));
    // this.store.dispatch(new SetFromRRM(state))
    this.sourceDialog$
      .pipe(
        tap((s) => {
          this.filterInfo.sourceDialog = s;
        })
      )
      .subscribe();
    this.showCheckbox$
      .pipe(
        tap((s) => {
          this.showCheckbox = s;
        })
      )
      .subscribe();
  }

  getResourceSelected(selectedPIDURIs: string[], pidUri: string) {
    return selectedPIDURIs.includes(decodeURIComponent(pidUri));
  }

  checkboxChanged(event: any) {
    let resourcePIDURI = decodeURIComponent(event.source.id);
    event.source.checked
      ? this.store.dispatch(new AddSelectedPIDURI(resourcePIDURI))
      : this.store.dispatch(new RemoveSelectedPIDURI(resourcePIDURI));
  }

  selectAllCheckboxChanged(event) {
    if (event.checked) {
      this.store.dispatch(new AddSelectedPIDURIs(this.pidUrisSearchResult));
    } else {
      this.store.dispatch(new ClearSelectedPIDURIs());
    }
  }

  ngOnInit() {
    this.store.dispatch(new FetchMetadata()).subscribe();
    this.logger.info("DMP_RESULT_PAGE_OPENED");
    this.filterInfo.filterMode = JSON.parse(
      this.route.snapshot.queryParamMap.get("filterView")
    );
    this.metadata$.subscribe((met) => {
      this.metadata = met;
    });

    this.searchResult$.subscribe((s) => {
      // this.activeTablist = [] // resize to orginal width;
      this.searchResult = s;
      this.setDidYouMean(s);
      this.loadingBatch = false;

      setTimeout(() => {
        if (
          this.searchResult != null &&
          this.searchResults != null &&
          this.searchResults.nativeElement.scrollHeight <=
            this.searchResults.nativeElement.offsetHeight && 
          this.searchResults.nativeElement.offsetHeight > 0
        ) {
          this.nextBatch(this.searchResult.hits.total);
        }
        if (
          this.filterInfo.filterMode &&
          this.filterInfo.sourceDialog == "addResource"
        ) {
          let filterOutTypes: string[] = [
            Constants.ResourceTypes.Table,
            Constants.ResourceTypes.Column,
          ];

          this.searchResult.hits.hits.forEach((hit) => {
            let hitResourceType = hit.source[
              Constants.Metadata.EntityType
            ].outbound.map((t) => t.uri);
            if (filterOutTypes.includes(hitResourceType[0])) {
              this.skipResult.push(hit.id);
            }
          });
        }
      }, 100);
    });
  }

  pageChanged(page: any) {
    this.changePage.emit(page.page);
  }

  setDidYouMean(searchResult: SearchResult) {
    try {
      const firstSuggest = Object.values(searchResult.suggest)[0][0];
      if (firstSuggest && firstSuggest.options && firstSuggest.options.length) {
        this.didYouMean = firstSuggest.options[0].text;
      }
    } catch {
      this.didYouMean = null;
    }
  }

  nextBatch(maxRecordCount: number) {
    if (this.loadingBatch) return;

    if (this.searchResult.hits.hits.length >= maxRecordCount) return;

    this.loadingBatch = true;
    this.store.dispatch(new FetchNextSearchResult(this.route)).subscribe();
  }

  acceptDidYouMean(dym: string) {
    this.store.dispatch(new ChangeSearchText(dym, false)).subscribe();
  }

  schemeUi(event) {
    if (!this.activeTablist.includes(event.activetabList) && event.isAdd) {
      this.activeTablist.push(event.activetabList);
    } else {
      if (!event.isAdd) {
        this.activeTablist.splice(
          this.activeTablist.indexOf(event.activetabList),
          1
        );
      }
    }
  }

  getActiveTab(piduri) {
    var id = decodeURIComponent(piduri);
    return this.activeTablist.includes(id);
  }
}
