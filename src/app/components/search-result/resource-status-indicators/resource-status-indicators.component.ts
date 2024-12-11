import {
  Component,
  OnChanges,
  SimpleChanges,
  Input,
  OnInit
} from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { ColidIconsModule } from 'src/app/modules/colid-icons/colid-icons.module';
import { Constants } from 'src/app/shared/constants';
import { SubscriptionHelperDirective } from 'src/app/shared/directives/subscription-helper.directive';

@Component({
  selector: 'app-resource-status-indicators',
  standalone: true,
  imports: [MatChipsModule, ColidIconsModule],
  templateUrl: './resource-status-indicators.component.html',
  styleUrls: ['./resource-status-indicators.component.scss']
})
export class ResourceStatusIndicatorsComponent
  extends SubscriptionHelperDirective
  implements OnChanges, OnInit
{
  @Input() entryLifeCycleStatus: string;
  @Input() resourceLinkedLifecycleStatus: string; // previous published revision

  entryChipColor: 'draft' | 'published' | 'deleted';
  resourceLinkedChipColor: 'draft' | 'published' | 'deleted';

  hasCreatePrivilege = false;

  get showResourceStatusIndicator(): boolean {
    return (
      this.hasCreatePrivilege ||
      this?.entryLifeCycleStatus ===
        Constants.Resource.LifeCycleStatus.MarkedDeletion
    );
  }

  constructor(private authService: AuthService) {
    super();
  }

  ngOnInit(): void {
    this.subscribeToAuth();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.entryLifeCycleStatus?.currentValue) {
      this.entryLifeCycleStatus = changes.entryLifeCycleStatus.currentValue;
      this.entryChipColor = this.findChipColor(this.entryLifeCycleStatus);
    }

    if (changes?.resourceLinkedLifecycleStatus?.currentValue) {
      this.resourceLinkedLifecycleStatus =
        changes.resourceLinkedLifecycleStatus.currentValue;
      this.resourceLinkedChipColor = this.findChipColor(
        this.resourceLinkedLifecycleStatus
      );
    }
  }

  private subscribeToAuth() {
    this.authService.hasCreatePrivilege$
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((hasCreatePrivilege) => {
        this.hasCreatePrivilege = hasCreatePrivilege;
      });
  }

  private findChipColor(
    lifeCycleStatus: string
  ): 'draft' | 'published' | 'deleted' {
    switch (lifeCycleStatus) {
      case Constants.Resource.LifeCycleStatus.Draft:
        return 'draft';
      case Constants.Resource.LifeCycleStatus.Published:
        return 'published';
      case Constants.Resource.LifeCycleStatus.MarkedDeletion:
        return 'deleted';
      default:
        throw new Error(
          'Unexpected lifecycle status value received: ' + lifeCycleStatus
        );
    }
  }
}
