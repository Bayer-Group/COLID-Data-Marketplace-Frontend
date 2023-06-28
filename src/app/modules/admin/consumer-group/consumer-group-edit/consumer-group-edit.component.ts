import { Component, OnDestroy } from "@angular/core";
import { Store } from "@ngxs/store";
import { ClearConsumerGroup } from "src/app/states/consumer-group.state";

@Component({
  selector: "app-consumer-group-edit",
  templateUrl: "./consumer-group-edit.component.html",
  styleUrls: ["./consumer-group-edit.component.css"],
})
export class ConsumerGroupEditComponent implements OnDestroy {
  isNew = false;
  constructor(private store: Store) {}

  ngOnDestroy() {
    this.store.dispatch(new ClearConsumerGroup()).subscribe();
  }
}
