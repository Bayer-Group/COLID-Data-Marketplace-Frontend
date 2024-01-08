import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SearchService } from "src/app/core/http/search.service";
import { UserLastChangedResource } from "src/app/shared/models/user/last-changed-resource-dto";
import { UserDto } from "src/app/shared/models/user/user-dto";

@Component({
  selector: "app-latest-resource-changes-tile",
  templateUrl: "./latest-resource-changes-tile.component.html",
  styleUrls: ["./latest-resource-changes-tile.component.scss"],
})
export class LatestResourceChangesTileComponent implements OnInit {
  @Input() user: UserDto;
  @Output() expansionPanelToggled = new EventEmitter<boolean>();
  lastChangedResources: UserLastChangedResource[] = [];
  totalAmountOfElements: number = 0;
  loadingBatch: boolean = false;

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.searchService
      .fetchLastChangedResourcesOfAnUser(
        this.user.emailAddress,
        this.lastChangedResources.length
      )
      .subscribe((res) => {
        this.totalAmountOfElements = res.total;
        this.lastChangedResources = res.changedResources;
      });
  }

  nextBatch() {
    if (this.loadingBatch) return;

    if (this.lastChangedResources.length >= this.totalAmountOfElements) return;

    this.loadingBatch = true;
    this.searchService
      .fetchLastChangedResourcesOfAnUser(
        this.user.emailAddress,
        this.lastChangedResources.length
      )
      .subscribe((res) => {
        this.loadingBatch = false;
        this.lastChangedResources = [
          ...this.lastChangedResources,
          ...res.changedResources,
        ];
      });
  }
}
