import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import {
  RangeFilter,
  RangeFilterSelection
} from 'src/app/shared/models/range-filter';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  DateAdapter
} from '@angular/material/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ActiveRangeFilters } from 'src/app/shared/models/active-range-filters';
import { SearchState } from 'src/app/states/search.state';
import { DatePickerCustomHeaderWithTodayButtonComponent } from './datepicker-custom-header-with-today-button.component';

export enum RangeDirection {
  From = 'from',
  To = 'to'
}

// https://momentjs.com/docs/#/parsing/string-format/
export const DATE_FORMAT = {
  parse: {
    dateInput: 'YYYY-MM-DD'
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-filter-box-item-daterange',
  templateUrl: './filter-box-item-daterange.component.html',
  styleUrls: ['./filter-box-item-daterange.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT }
  ],
  encapsulation: ViewEncapsulation.None
})
export class FilterBoxItemDaterangeComponent implements OnInit {
  @Input() rangeFilter: RangeFilter;
  @Select(SearchState.getActiveRangeFilters)
  activeRangeFilters$: Observable<ActiveRangeFilters>;

  datePickerCustomHeader = DatePickerCustomHeaderWithTodayButtonComponent;

  _selection: RangeFilterSelection;
  @Input() set selection(rangeFilter: RangeFilterSelection) {
    this._selection = rangeFilter;
    this.setRangeFilter();
  }

  @Output() changeRange: EventEmitter<any> = new EventEmitter<any>();
  @Output() resetSelection: EventEmitter<void> = new EventEmitter();

  internalValueFrom: Date = null;
  internalValueTo: Date = null;

  initial: { [key: string]: Date } = {};

  constructor(private datePipe: DatePipe) {}

  ngOnInit() {
    this.setRangeFilter();
  }

  setRangeFilter() {
    this.initial[RangeDirection.From] = new Date(this._selection.from);
    this.initial[RangeDirection.To] = new Date(this._selection.to);
    this.internalValueFrom = this.initial[RangeDirection.From];
    this.internalValueTo = this.initial[RangeDirection.To];
  }

  onValueChangeFrom($event: MatDatepickerInputEvent<Date>) {
    if ($event.value) {
      this.internalValueFrom = $event.value;
      this.onValueChange(this.internalValueFrom, RangeDirection.From);
    }
  }

  onValueChangeTo($event: MatDatepickerInputEvent<Date>) {
    if ($event.value) {
      this.internalValueTo = $event.value;
      this.onValueChange(this.internalValueTo, RangeDirection.To);
    }
  }

  onValueChange(newDate: Date, direction: RangeDirection) {
    // skip initial change event
    if (newDate === this.initial[direction]) {
      return;
    }

    const currentFrom: Date = this.internalValueFrom;
    const currentTo: Date = this.internalValueTo;

    if (direction === RangeDirection.From) {
      if (newDate > currentTo) {
        newDate = new Date(currentTo);
        newDate.setDate(newDate.getDate() - 1);
        setTimeout(() => (this.internalValueFrom = newDate));
        // returning here because value change will fire new onValueChange event
        return;
      }
    } else {
      if (newDate < currentFrom) {
        newDate = new Date(currentFrom);
        newDate.setDate(newDate.getDate() + 1);
        setTimeout(() => (this.internalValueTo = newDate));
        // returning here because value change will fire new onValueChange event
        return;
      }
    }

    const formattedDate = this.datePipe.transform(newDate, 'yyyy-MM-dd');
    const selection = new RangeFilterSelection();
    if (direction === 'from') {
      selection.from = formattedDate;
      selection.to = this.datePipe.transform(currentTo, 'yyyy-MM-dd');
    } else {
      selection.from = this.datePipe.transform(currentFrom, 'yyyy-MM-dd');
      selection.to = formattedDate;
    }
    this.changeRange.emit(selection);
  }

  removeDateSelectionFromFiltering() {
    this.internalValueFrom = new Date(this.rangeFilter.from);
    this.internalValueTo = new Date(this.rangeFilter.to);
    this.resetSelection.emit();
  }
}
