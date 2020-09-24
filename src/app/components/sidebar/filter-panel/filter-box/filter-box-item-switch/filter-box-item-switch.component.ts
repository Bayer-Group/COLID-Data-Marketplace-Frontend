import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AggregationBucket} from 'src/app/shared/models/aggregation-bucket';

@Component({
  selector: 'app-filter-box-item-switch',
  templateUrl: './filter-box-item-switch.component.html',
  styleUrls: ['./filter-box-item-switch.component.scss']
})
export class FilterBoxItemSwitchComponent implements OnInit {
  @Input() aggregation: AggregationBucket;

  @Output() changeFilterBucket: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() active = false;
  constructor() { }

  ngOnInit() {
  }

  changeFilterItem() {
    this.active = !this.active;
    this.changeFilterBucket.emit(this.active);
  }
}
