import { Component, OnInit } from "@angular/core";
import { Store, Select } from "@ngxs/store";
import {
  ConsumerGroupState,
  FetchConsumerGroupMetadata,
} from "src/app/states/consumer-group.state";
import { Observable } from "rxjs";
import { MetaDataProperty } from "src/app/shared/models/metadata/meta-data-property";

@Component({
  selector: "app-consumer-group",
  templateUrl: "./consumer-group.component.html",
  styleUrls: ["./consumer-group.component.css"],
})
export class ConsumerGroupComponent implements OnInit {
  @Select(ConsumerGroupState.getConsumerGroupMetadata)
  consumerGroupMetadata$: Observable<Array<MetaDataProperty>>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new FetchConsumerGroupMetadata()).subscribe();
  }
}
