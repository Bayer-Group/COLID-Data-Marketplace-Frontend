import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { catchError, switchMap, tap } from "rxjs/operators";
import { ResourceApiService } from "src/app/core/http/resource.api.service";
import { UserInfoApiService } from "src/app/core/http/user-info.api.service";
import { MetadataService } from "src/app/core/http/metadata.service";
import { LinkHistorySearchBody } from "src/app/shared/models/linkHistory/link-history-search-body";
import { HistoryItemTableEntry } from "./link-history/link-history.component";
import moment from "moment";
import { Subscription, EMPTY, BehaviorSubject, Observable } from "rxjs";

@Component({
  selector: "app-link-history-view",
  templateUrl: "./link-history-view.component.html",
  styleUrls: ["./link-history-view.component.css"],
})
export class LinkHistoryViewComponent implements OnInit, OnDestroy {
  filters: FormGroup;
  get email() {
    return this.filters.get("email");
  }
  get linkType() {
    return this.filters.get("linkType");
  }

  masterSub: Subscription = new Subscription();

  emailFilterSource: string[] = [];
  emailFilterData: string[] = [];
  emailSearchString: string = "";
  filteredEmailAddresses: Observable<string[]>;
  linkTypeFilterSource = [];

  searchBody$: BehaviorSubject<LinkHistorySearchBody>;
  from = 0;
  size = 30;

  historyItemsSource: HistoryItemTableEntry[];
  allItemsLoaded: boolean = false;
  isLoading: boolean = false;

  constructor(
    private userInfoApiService: UserInfoApiService,
    private resourceApiService: ResourceApiService,
    private metaDataApiService: MetadataService
  ) {
    this.initFilters();
    this.masterSub.add(
      this.searchBody$
        .pipe(
          switchMap((searchBody) => {
            if (this.allItemsLoaded) return EMPTY;
            return this.loadHistoryItems(searchBody);
          })
        )
        .subscribe()
    );
    this.masterSub.add(
      this.filters.get("end").valueChanges.subscribe((val) => {
        if (val) {
          this.resetResults();
          const startDate = this.filters.get("start").value;
          this.setSearchBody(
            [
              { property: "endDate", value: val.toDate() },
              { property: "startDate", value: startDate.toDate() },
            ],
            true
          );
        }
      })
    );
    this.masterSub.add(
      this.filters.get("email").valueChanges.subscribe((val) => {
        this.resetResults();
        this.resetEmailSearch();
        this.setSearchBody([{ property: "email", value: val }], true);
      })
    );
    this.masterSub.add(
      this.filters.get("linkType").valueChanges.subscribe((val) => {
        this.resetResults();
        this.setSearchBody([{ property: "linkType", value: val }], true);
      })
    );
  }

  ngOnInit(): void {
    this.userInfoApiService
      .getUsers()
      .pipe(
        tap((res) => {
          this.emailFilterSource = res.map((u) => u.emailAddress);
          this.emailFilterData = this.emailFilterSource.slice();
        })
      )
      .subscribe();
    this.metaDataApiService
      .getLinkTypes()
      .pipe(tap((res) => (this.linkTypeFilterSource = res)))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.masterSub.unsubscribe();
  }

  loadHistoryItems(searchBody) {
    this.isLoading = true;
    return this.resourceApiService.searchLinkHistory(searchBody).pipe(
      tap((res) => {
        const mappedResponse = res.map(
          (item) =>
            <HistoryItemTableEntry>{
              linkType: {
                key: item.linkType,
                value: item.linkTypeLabel,
              },
              linkStatus: item.linkStatus,
              source: item.linkStartResourcePidUri,
              sourceName: item.linkStartResourceLabel,
              sourceType: item.linkStartResourceType,
              target: item.linkEndResourcePidUri,
              targetName: item.linkEndResourceLabel,
              targetType: item.linkEndResourceType,
              dateCreated: item.dateCreated,
              dateDeleted: item.dateDeleted,
              author: item.author,
              deletedBy: item.deletedBy,
            }
        );
        if (!this.historyItemsSource) {
          this.historyItemsSource = mappedResponse;
        } else {
          this.historyItemsSource = [
            ...this.historyItemsSource,
            ...mappedResponse,
          ];
        }
        if (mappedResponse.length < this.size) {
          this.allItemsLoaded = true;
        }
        this.isLoading = false;
      }),
      catchError((_) => {
        this.isLoading = false;
        return EMPTY;
      })
    );
  }

  loadNextBatch(currentHistoryItemsCount: number) {
    if (
      currentHistoryItemsCount <= this.historyItemsSource.length &&
      !this.isLoading
    ) {
      const newFrom = this.searchBody$.value.from + 1;
      this.setSearchBody([{ property: "from", value: newFrom }], false);
    }
  }

  sortResults({
    column,
    descending,
  }: {
    column: string;
    descending?: boolean;
  }) {
    this.resetResults();
    if (descending == null) {
      this.setSearchBody(
        [
          { property: "orderByColumn", value: null },
          { property: "orderDescending", value: true },
        ],
        true
      );
    } else {
      this.setSearchBody(
        [
          { property: "orderByColumn", value: column },
          { property: "orderDescending", value: descending },
        ],
        true
      );
    }
  }

  onEmailSearch(searchValue: string) {
    this.emailSearchString = searchValue;
    if (searchValue === "") {
      this.emailFilterData = this.emailFilterSource.slice();
    } else {
      const filterValue = searchValue.toLowerCase();
      this.emailFilterData = this.emailFilterSource.filter((email) =>
        email.toLowerCase().includes(filterValue)
      );
    }
  }

  resetEmailSearch() {
    this.emailSearchString = "";
    this.emailFilterData = this.emailFilterSource.slice();
  }

  private resetResults() {
    this.historyItemsSource = null;
  }

  private setSearchBody(
    properties: { property: string; value: any }[],
    resetList: boolean
  ) {
    const currentSearchBody = this.searchBody$.value;
    properties.forEach((p) => {
      currentSearchBody[p.property] = p.value;
    });
    if (resetList) {
      currentSearchBody.from = 0;
      this.allItemsLoaded = false;
    }
    this.searchBody$.next(currentSearchBody);
  }

  private initFilters() {
    const filterEndDate = moment().utcOffset(0).startOf("day");
    const filterStartDate = moment()
      .utcOffset(0)
      .startOf("day")
      .subtract(14, "d");
    const searchBody = {
      startDate: filterStartDate.toDate(),
      endDate: filterEndDate.toDate(),
      email: null,
      linkType: null,
      from: this.from,
      size: this.size,
      orderByColumn: null,
      orderDescending: true,
    };
    this.searchBody$ = new BehaviorSubject(searchBody);
    this.filters = new FormGroup({
      start: new FormControl<moment.Moment>(filterStartDate),
      end: new FormControl<moment.Moment>(filterEndDate),
      email: new FormControl<string | null>(null),
      linkType: new FormControl<string | null>(null),
    });
  }
}
