import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { Observable } from "rxjs";
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.scss"],
})
export class SearchBarComponent implements AfterViewInit {
  @ViewChild(MatAutocompleteTrigger, { static: true })
  autocomplete: MatAutocompleteTrigger;
  @ViewChild("search") searchbar: ElementRef;

  @Input() initialSearchText: string;
  @Input() autocompleteResult: Observable<string[]>;
  @Input() focusSearchbar: boolean = true;

  @Output() searchChange = new EventEmitter();
  @Output() inputChange = new EventEmitter();

  // Internal flag to block the first InputChangeEvent on the searchbar after hitting return/enter key.
  // Otherwise InputChangeEvent is emitted on return/enter key and the typeahead auto-suggestions shows up.
  blockInputChange = false;

  autocompleteOpened = false;

  constructor() {}

  ngAfterViewInit(): void {
    if (this.focusSearchbar) {
      this.searchbar.nativeElement.focus();
    }
  }

  onInputChange(text: string) {
    if (this.blockInputChange === false) {
      this.inputChange.emit(text);
    }

    this.blockInputChange = false;
  }

  onEnter(text: string) {
    this.autocomplete.closePanel();

    this.blockInputChange = true;
    if (text === "" || text === "+") {
      text = "*";
    }
    this.searchChange.emit(text);
  }

  handleOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.onEnter(event.option.value);
  }
}
