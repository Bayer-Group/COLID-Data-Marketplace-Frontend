import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SearchResult } from 'src/app/shared/models/search-result';
import { FetchMetadata, MetadataState } from 'src/app/states/metadata.state';
import { SetFilterMode, SetFromRRM, SetSourceDialog } from 'src/app/states/rrm.state';
import { SearchByPidUri, SearchState } from 'src/app/states/search.state';
import { SearchResultComponent } from '../search-result/search-result.component';

@Component({
  selector: 'app-search-result-standalone-container',
  templateUrl: './search-result-standalone-container.component.html',
  styleUrls: ['./search-result-standalone-container.component.scss'],

})
export class SearchResultStandaloneContainerComponent implements OnInit {

  @Select(MetadataState.getMetadata) metadata$: Observable<any>;
  @Select(SearchState.getDocumentResult) searchResult$: Observable<SearchResult>;

  @ViewChild('res')
  searchResultComponent: SearchResultComponent;

  pidUri: string = "";
  metadata: any;
  searchResult: any;
  loading: boolean = true;
  filterView: boolean = true;
  pidUriFromQueryString: string = null;

  _store: Store;
  constructor(private store: Store, private route: ActivatedRoute) {
    this._store = store;
    this.pidUriFromQueryString = decodeURI(this.route.snapshot.queryParamMap.get('pidUri'));
    if (this.pidUriFromQueryString && this.pidUriFromQueryString != 'null') {
      this.pidUri = this.pidUriFromQueryString;
    }
  }

  ngOnInit(): void {
    //this._store.dispatch(new SearchByPidUri(this.pidUri));
    this.metadata$.subscribe(met => {
      this.metadata = met;
      if(this.searchResult != null){
        this.loading = false;
      }
    });
    this.loading = true;
    this._store.dispatch(new SearchByPidUri(this.pidUri));
    this.searchResult$.subscribe(s => {
      if(s != null){
        if(this.metadata == null){
          this._store.dispatch(new FetchMetadata());
        } else {
          this.loading = false;
        }
        this.searchResult = s;
      }
    });
    this.loading = false;
    window.addEventListener("message", this.receiveMessage.bind(this), false);
  }

  receiveMessage(event: any) {
    const message = event.data.message;
    if (message == "nodeSelection") {
      this._store.dispatch(new SetFromRRM(true));
      //remove trailing slash from PID URI
      this.pidUri = event.data.value;
      this.loading = true;
      this._store.dispatch(new SearchByPidUri(this.pidUri));
    }

    if (message == "filterView") {
      this.filterView = event.data.value;
      this._store.dispatch(new SetFilterMode(this.filterView));
    }

    if (message == "sourceDialog") {
      this._store.dispatch(new SetSourceDialog(event.data.value));
    }
  }

}
