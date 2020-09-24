import { Component, OnInit, Input, Output } from '@angular/core';
import { AggregationBucket } from 'src/app/shared/models/aggregation-bucket';
import { Store } from '@ngxs/store';
import { Aggregation, AggregationType } from 'src/app/shared/models/aggregation';
import { ChangeActiveAggregationBuckets, ChangeActiveAggregationBucketList } from 'src/app/states/search.state';
import { Observable } from 'rxjs';

enum CollapseStates {
  Initial,
  More,
  All
}

@Component({
  selector: 'app-filter-box',
  templateUrl: './filter-box.component.html',
  styleUrls: ['./filter-box.component.scss']
})
export class FilterBoxComponent implements OnInit {
  
  constructor(private store: Store) {
  }

  readonly initialSize = 7;
  readonly moreSize = 20;

  @Input() aggregation: Aggregation;
  @Input() activeAggregationBuckets: string[];
  @Input() initialFilterBox: boolean = false;

  @Input() filterType: 'taxonomy' | 'checkbox' | 'select' = "checkbox";

  aggregationType = AggregationType;
  visibleBuckets: AggregationBucket[] = [];
  hidden: boolean;
  loading: boolean;
  canShowMore: boolean;
  canShowLess: boolean;
  canShowAll: boolean;
  collapseState: CollapseStates;

  changeActiveAggregationBucketList = new Observable<any>();
  
  ngOnInit() {
    this.setCollapseState(this.filterType === 'checkbox' ? CollapseStates.Initial : CollapseStates.All);
  }

  showLess() {
    this.setCollapseState(this.collapseState === CollapseStates.All ? CollapseStates.More : CollapseStates.Initial);
  }

  showMore() {
    this.setCollapseState(CollapseStates.More);
  }

  showAll() {
    this.setCollapseState(CollapseStates.All);
  }

  setCollapseState(state: CollapseStates) {
    this.collapseState = state;
    switch (state) {
      case CollapseStates.Initial: this.visibleBuckets = this.aggregation.buckets.slice(0, this.initialSize); break;
      case CollapseStates.More: this.visibleBuckets = this.aggregation.buckets.slice(0, this.moreSize); break;
      case CollapseStates.All: this.visibleBuckets = this.aggregation.buckets; break;
    }

    this.canShowAll = this.collapseState === CollapseStates.More && this.aggregation.buckets.length > this.moreSize;
    this.canShowMore = this.collapseState === CollapseStates.Initial && this.aggregation.buckets.length > this.initialSize;
    this.canShowLess = this.collapseState !== CollapseStates.Initial;
  }



  active(aggregationBucket: AggregationBucket) {
    return this.activeAggregationBuckets == null
      || !Array.isArray(this.activeAggregationBuckets) ? false : this.activeAggregationBuckets.includes(aggregationBucket.key);
  }

  filterItemChanged(active: boolean, bucket: AggregationBucket) {
    if (this.aggregation) {
      this.store.dispatch(new ChangeActiveAggregationBuckets(this.aggregation, bucket, active, this.initialFilterBox)).subscribe();
    }
  }

  filterItemsChanged(buckets: string[]) {
    if (this.aggregation) {
      this.store.dispatch(new ChangeActiveAggregationBucketList(this.aggregation, buckets, this.initialFilterBox)).subscribe();
    }
  }

  multiSelectFilterItemsChanged(buckets: string[]) {
    if (this.aggregation) {
      this.store.dispatch(new ChangeActiveAggregationBucketList(this.aggregation, buckets, this.initialFilterBox)).subscribe();
    }
  }
}
