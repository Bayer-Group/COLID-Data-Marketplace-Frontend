import { Component, OnInit, OnDestroy } from '@angular/core';
import { ColidEntrySubscriptionDto } from 'src/app/shared/models/user/colid-entry-subscription-dto';
import { Observable, Subscription } from 'rxjs';
import { Constants } from 'src/app/shared/constants';
import {
  UserInfoState,
  AddColidEntrySubscription,
  ReloadUser,
  RemoveColidEntrySubscription
} from 'src/app/states/user-info.state';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { ResourceOverviewCTO } from 'src/app/shared/models/resources/resource-overview-cto';
import { Store, Select } from '@ngxs/store';
import {
  ColidEntrySubscriptionsState,
  FetchColidEntrySubscriptions
} from 'src/app/states/colid-entry-subscription.state';
import { ColidEntrySubscription } from 'src/app/shared/models/colidEntrySubscription/colid-entry-subscription';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-resource-subscriptions',
  templateUrl: './resource-subscriptions.component.html',
  styleUrls: ['./resource-subscriptions.component.scss']
})
export class ResourceSubscriptionsComponent implements OnInit, OnDestroy {
  constants = Constants;
  @Select(UserInfoState.getColidEntrySubscriptions)
  colidEntrySubscriptions$: Observable<ColidEntrySubscriptionDto[]>;

  @Select(ColidEntrySubscriptionsState.getColidEntrySubscriptions)
  colidEntrySubscriptionOverview$: Observable<ResourceOverviewCTO>;

  @Select(ColidEntrySubscriptionsState.loading)
  loading$: Observable<boolean>;

  cesSubscription: Subscription;
  cesoSubscription: Subscription;

  colidUrl = environment.pidUrl;

  loading: boolean = false;
  colidEntrySubscriptionDtos: ColidEntrySubscriptionDto[];
  colidEntrySubscriptions: Map<string, ColidEntrySubscription>;
  colidEntrySubscriptionsUnsubscripted: Map<string, ColidEntrySubscription> =
    new Map<string, ColidEntrySubscription>();

  constructor(
    private store: Store,
    private snackbar: ColidMatSnackBarService
  ) {}

  ngOnInit() {
    this.loadColidEntrySubscriptions();
    this.loading$.subscribe((loading) => {
      this.loading = loading;
    });
    this.reloadColidEntrySubscriptions();
  }

  ngOnDestroy() {
    this.cesSubscription.unsubscribe();
    this.cesoSubscription.unsubscribe();
  }

  loadColidEntrySubscriptions() {
    this.cesSubscription = this.colidEntrySubscriptions$.subscribe(
      (colidEntrySubscriptions) => {
        this.colidEntrySubscriptionDtos = colidEntrySubscriptions;
        this.store
          .dispatch(new FetchColidEntrySubscriptions(colidEntrySubscriptions))
          .subscribe();
      }
    );

    this.cesoSubscription = this.colidEntrySubscriptionOverview$.subscribe(
      (colidEntrySubscriptionOverview) => {
        if (colidEntrySubscriptionOverview == null) {
          return;
        }

        this.colidEntrySubscriptions = new Map<
          string,
          ColidEntrySubscription
        >();
        colidEntrySubscriptionOverview.items.forEach((ro) => {
          let colidEntrySubscription = new ColidEntrySubscription(
            ro.name,
            ro.definition,
            ro.resourceType,
            ro.lifeCycleStatus
          );
          this.colidEntrySubscriptions.set(ro.pidUri, colidEntrySubscription);
        });

        this.colidEntrySubscriptions = new Map([
          ...this.colidEntrySubscriptionsUnsubscripted,
          ...this.colidEntrySubscriptions
        ]);
      }
    );
  }

  reloadColidEntrySubscriptions() {
    this.colidEntrySubscriptionsUnsubscripted.clear();
    this.store.dispatch(new ReloadUser()).subscribe();
  }

  subscribeToResource(pidUri: string) {
    this.colidEntrySubscriptionsUnsubscripted.delete(pidUri);

    let colidEntrySubscriptionDto = new ColidEntrySubscriptionDto(pidUri);
    this.store
      .dispatch(new AddColidEntrySubscription(colidEntrySubscriptionDto))
      .subscribe(() => {
        var subscription = this.colidEntrySubscriptions.get(pidUri);
        subscription.isSubscribed = true;
        this.colidEntrySubscriptions.set(pidUri, subscription);

        this.snackbar.success(
          'Resource subscribed',
          'You have successfully subscribed the resource.'
        );
      });
  }

  unsubscribeFromResource(pidUri: string) {
    const entryToUnsubscribe = this.colidEntrySubscriptions.get(pidUri);
    entryToUnsubscribe.isSubscribed = false;
    this.colidEntrySubscriptionsUnsubscripted.set(pidUri, entryToUnsubscribe);

    let colidEntrySubscriptionDto = new ColidEntrySubscriptionDto(pidUri);
    this.store
      .dispatch(new RemoveColidEntrySubscription(colidEntrySubscriptionDto))
      .subscribe(() => {
        this.snackbar.success(
          'Resource unsubscribed',
          'You have successfully unsubscribed to the resource.'
        );
      });
  }
}
