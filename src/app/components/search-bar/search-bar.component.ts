import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements AfterViewInit {
  @Input() initialSearchText: string;
  @Input() autocompleteResult: Observable<string[]>;
  @Input() focusSearchbar: boolean = false;

  @Output() searchChange = new EventEmitter();
  @Output() inputChange = new EventEmitter();

  @ViewChild(MatAutocompleteTrigger, { static: true })
  autocomplete: MatAutocompleteTrigger;

  @ViewChild('search') searchbar: ElementRef;

  // Internal flag to block the first InputChangeEvent on the searchbar after hitting return/enter key.
  // Otherwise InputChangeEvent is emitted on return/enter key and the typeahead auto-suggestions shows up.
  blockInputChange = false;

  ngAfterViewInit(): void {
    if (this.focusSearchbar) {
      this.searchbar.nativeElement.focus();
    }
    this.autocomplete.closePanel();
  }

  onInputChange(text: string) {
    if (this.blockInputChange === false) {
      this.inputChange.emit(text);
    }

    this.blockInputChange = false;
  }

  onEnter(text: string) {
    this.blockInputChange = true;
    if (text === '' || text === '+') {
      text = '*';
    }
    this.searchChange.emit(text);
    this.autocomplete.closePanel();
  }

  handleOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.onEnter(event.option.value);
  }
}
