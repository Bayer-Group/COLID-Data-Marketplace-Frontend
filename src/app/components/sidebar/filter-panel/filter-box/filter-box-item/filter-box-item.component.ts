import { Component, Input, Output, EventEmitter } from "@angular/core";
import { AggregationBucket } from "src/app/shared/models/aggregation-bucket";

@Component({
  selector: "app-filter-box-item",
  templateUrl: "./filter-box-item.component.html",
  styleUrls: ["./filter-box-item.component.scss"],
})
export class FilterBoxItemComponent {
  @Input() key: string;
  @Input() bucket: AggregationBucket;

  @Output() changeFilterBucket: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  @Input() active = false;
  constructor() {}

  changeFilterItem() {
    this.active = !this.active;
    this.changeFilterBucket.emit(this.active);
  }
}
