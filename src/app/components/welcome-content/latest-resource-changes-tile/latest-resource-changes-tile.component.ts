import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subscription, switchMap } from 'rxjs';
import { SearchService } from 'src/app/core/http/search.service';
import { UserLastChangedResource } from 'src/app/shared/models/user/last-changed-resource-dto';
import { UserInfoState } from 'src/app/states/user-info.state';

@Component({
  selector: 'app-latest-resource-changes-tile',
  templateUrl: './latest-resource-changes-tile.component.html',
  styleUrls: ['./latest-resource-changes-tile.component.scss']
})
export class LatestResourceChangesTileComponent implements OnInit {
  @Select(UserInfoState.getUserEmail) userEmail$: Observable<string>;
  userEmail: string;
  @Output() expansionPanelToggled = new EventEmitter<boolean>();
  lastChangedResources: UserLastChangedResource[] = [];
  totalAmountOfElements: number = 0;
  loadingBatch: boolean = false;

  masterSub: Subscription = new Subscription();

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.masterSub.add(
      this.userEmail$
        .pipe(
          switchMap((userEmail: string) => {
            this.userEmail = userEmail;
            return this.searchService.fetchLastChangedResourcesOfAnUser(
              userEmail,
              this.lastChangedResources.length
            );
          })
        )
        .subscribe((res) => {
          this.totalAmountOfElements = res.total;
          this.lastChangedResources = res.changedResources;
        })
    );
  }

  nextBatch() {
    if (this.loadingBatch) return;

    if (this.lastChangedResources.length >= this.totalAmountOfElements) return;

    this.loadingBatch = true;
    this.searchService
      .fetchLastChangedResourcesOfAnUser(
        this.userEmail,
        this.lastChangedResources.length
      )
      .subscribe((res) => {
        this.loadingBatch = false;
        this.lastChangedResources = [
          ...this.lastChangedResources,
          ...res.changedResources
        ];
      });
  }
}
