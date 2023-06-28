import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { ConsumerGroupResultDTO } from "src/app/shared/models/consumerGroups/ConsumerGroupResultDTO";
import {
  ConsumerGroupState,
  FetchConsumerGroups,
  ReactivateConsumerGroup,
} from "src/app/states/consumer-group.state";
import { MetaDataProperty } from "src/app/shared/models/metadata/meta-data-property";
import { Constants } from "src/app/shared/constants";

@Component({
  selector: "app-consumer-group-display",
  templateUrl: "./consumer-group-display.component.html",
  styleUrls: ["./consumer-group-display.component.css"],
})
export class ConsumerGroupDisplayComponent implements OnInit {
  @Select(ConsumerGroupState.getConsumerGroups) consumerGroups$: Observable<
    Array<ConsumerGroupResultDTO>
  >;
  @Select(ConsumerGroupState.getConsumerGroupMetadata) metadata$: Observable<
    Array<MetaDataProperty>
  >;

  isConsumerGroupReactivating: ConsumerGroupResultDTO;

  lifecycleStatusMapping = {
    [Constants.ConsumerGroup.LifecycleStatus.Active]: "Active",
    [Constants.ConsumerGroup.LifecycleStatus.Deprecated]: "Deprecated",
  };

  constructor(private router: Router, private store: Store) {}

  ngOnInit() {
    this.loadConsumerGroups();
  }

  loadConsumerGroups() {
    this.store.dispatch(new FetchConsumerGroups());
  }

  createConsumerGroup() {
    this.router.navigate(["admin/consumerGroups/create"]);
  }

  reactivateConsumerGroup(consumerGroup: ConsumerGroupResultDTO) {
    this.isConsumerGroupReactivating = consumerGroup;
    this.store
      .dispatch(new ReactivateConsumerGroup(consumerGroup.id))
      .subscribe(
        () => {
          this.isConsumerGroupReactivating = null;
        },
        (_) => {
          this.isConsumerGroupReactivating = null;
        }
      );
  }

  isActive(consumerGroup: ConsumerGroupResultDTO) {
    return (
      consumerGroup.lifecycleStatus ===
      Constants.ConsumerGroup.LifecycleStatus.Active
    );
  }

  getStatus(consumerGroup: ConsumerGroupResultDTO) {
    return this.lifecycleStatusMapping[consumerGroup.lifecycleStatus];
  }
}
