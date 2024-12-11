import { Component, OnInit, Input } from '@angular/core';
import {
  RangeFilter,
  RangeFilterSelection
} from 'src/app/shared/models/range-filter';
import { Store } from '@ngxs/store';
import {
  ChangeActiveRangeFilter,
  ResetSingleActiveRangeFilter
} from 'src/app/states/search.state';

@Component({
  selector: 'app-range-box',
  templateUrl: './range-box.component.html',
  styleUrls: ['./range-box.component.scss']
})
export class RangeBoxComponent implements OnInit {
  @Input() rangeFilter: RangeFilter;

  _activeRangeFilter: RangeFilterSelection;

  @Input() set activeRangeFilter(rangeFilter: RangeFilterSelection) {
    this._activeRangeFilter = rangeFilter;
    this.setRangeFilter();
  }

  @Input() initialRangeBox: boolean = false;
  @Input() last: boolean = false;

  hidden: boolean;
  loading: boolean;
  rangeFilterSelection: RangeFilterSelection;

  constructor(private store: Store) {}

  ngOnInit() {
    this.setRangeFilter();
  }

  setRangeFilter() {
    if (
      this._activeRangeFilter &&
      this._activeRangeFilter.from &&
      this._activeRangeFilter.to
    ) {
      this.rangeFilterSelection = this._activeRangeFilter;
    } else {
      this.rangeFilterSelection = {
        from: this.rangeFilter?.from,
        to: this.rangeFilter?.to
      };
    }
  }

  rangeChanged(rangeSelection: RangeFilterSelection) {
    this.store.dispatch(
      new ChangeActiveRangeFilter(
        this.rangeFilter.key,
        rangeSelection,
        this.initialRangeBox
      )
    );
  }

  resetToDefault() {
    this.store.dispatch(
      new ResetSingleActiveRangeFilter(
        this.rangeFilter.key,
        this.initialRangeBox
      )
    );
  }
}
