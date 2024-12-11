import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FetchAutocompleteResults,
  SearchState
} from '../../states/search.state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search-bar-autocomplete',
  templateUrl: './search-bar-autocomplete.component.html',
  styleUrls: ['./search-bar-autocomplete.component.scss']
})
export class SearchBarAutocompleteComponent {
  @Input() initialSearchText;
  @Input() focusSearchbar: boolean = true;

  @Output() searchChange = new EventEmitter();
  @Output() inputChange = new EventEmitter();

  @Select(SearchState.getAutoCompleteResults) autocompleteResult$: Observable<
    string[]
  >;

  constructor(private store: Store) {}

  handleInputChange(searchText: string) {
    this.store.dispatch(new FetchAutocompleteResults(searchText)).subscribe();
    this.inputChange.emit(searchText);
  }

  handleSearchChange(searchText: string) {
    this.searchChange.emit(searchText);
  }
}
