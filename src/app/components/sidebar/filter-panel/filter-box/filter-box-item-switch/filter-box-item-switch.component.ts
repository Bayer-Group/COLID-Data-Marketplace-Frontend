import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AggregationBucket } from 'src/app/shared/models/aggregation-bucket';

// TODO: Unify - duplicate code with colid-ui-editor-frontend

@Component({
  selector: 'app-filter-box-item-switch',
  templateUrl: './filter-box-item-switch.component.html',
  styleUrls: ['./filter-box-item-switch.component.scss']
})
export class FilterBoxItemSwitchComponent {
  @Input() aggregation: AggregationBucket;

  @Output() changeFilterBucket: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  @Input() active = false;

  changeFilterItem() {
    this.active = !this.active;
    this.changeFilterBucket.emit(this.active);
  }
}
