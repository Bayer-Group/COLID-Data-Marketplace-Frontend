import { Component, OnInit } from '@angular/core';
import { WelcomeMessageApiService } from 'src/app/core/http/welcome-message.api.service';
import { WelcomeMessage } from 'src/app/shared/models/welcome-message';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { EntityFormStatus } from 'src/app/shared/models/entity-form.status';
import {
  UpdateWelcomeMessageDataMarketplace,
  WelcomeMessageState
} from 'src/app/states/welcome-message.state';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-welcome-message-data-marketplace',
  templateUrl: './welcome-message-data-marketplace.component.html',
  styleUrls: ['./welcome-message-data-marketplace.component.css']
})
export class WelcomeMessageDataMarketplaceComponent implements OnInit {
  status: EntityFormStatus = EntityFormStatus.INITIAL;
  @Select(WelcomeMessageState.getWelcomeMessageDataMarketplace)
  welcomeMessageDataMarketplace$: Observable<WelcomeMessage>;
  welcomeMessageDataMarketplaceSub: Subscription;
  welcomeMessageDataMarketplace: WelcomeMessage;

  msg_header_datamarketplace = 'Welcome Message Data Marketplace';
  error_general = 'An error occured during welcome message processing';
  success_msg_update = 'Message has been updated successfully';

  constructor(
    private welcomeMessageApiService: WelcomeMessageApiService,
    private snackBar: ColidMatSnackBarService,
    private store: Store
  ) {}

  ngOnInit() {
    this.welcomeMessageApiService.getWelcomeMessageDataMarketplace().subscribe(
      (res: WelcomeMessage) => {
        this.welcomeMessageDataMarketplace = res;
      },
      (_) => {
        this.snackBar.error(
          this.msg_header_datamarketplace,
          this.error_general
        );
      }
    );
    this.welcomeMessageDataMarketplaceSub =
      this.welcomeMessageDataMarketplace$.subscribe((res) => {
        if (res != null) {
          this.welcomeMessageDataMarketplace = res;
        }
      });
  }

  updateWelcomeMessageDataMarketplace(message: string) {
    this.status = EntityFormStatus.LOADING;

    this.store
      .dispatch(new UpdateWelcomeMessageDataMarketplace(message))
      .subscribe(
        (_) => {
          this.status = EntityFormStatus.SUCCESS;
          this.snackBar.success(
            this.msg_header_datamarketplace,
            this.success_msg_update
          );
        },
        (_) => {
          this.status = EntityFormStatus.ERROR;
          this.snackBar.error(
            this.msg_header_datamarketplace,
            this.error_general
          );
        }
      );
  }
}
