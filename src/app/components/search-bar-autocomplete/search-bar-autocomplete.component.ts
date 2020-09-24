import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FetchAutocompleteResults, SearchState} from '../../states/search.state';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-search-bar-autocomplete',
  templateUrl: './search-bar-autocomplete.component.html',
  styleUrls: ['./search-bar-autocomplete.component.scss']
})
export class SearchBarAutocompleteComponent implements OnInit {
  @Select(SearchState.getAutoCompleteResults) autocompleteResult$: Observable<string[]>;
  @Output() searchChange = new EventEmitter();
  @Output() inputChange = new EventEmitter();

  @Input() initialSearchText;

  constructor(private store: Store) { }

  ngOnInit() {
    console.log("app-search-bar-autocomplete ngOnInit");

  }

  handleInputChange(searchText: string) {
    console.log("app-search-bar-autocomplete handleInputChange");

    this.store.dispatch(new FetchAutocompleteResults(searchText)).subscribe();
    this.inputChange.emit(searchText);
  }

  handleSearchChange(searchText: string) {
    console.log("app-search-bar-autocomplete handleSearchChange");

    this.searchChange.emit(searchText);
  }
}
