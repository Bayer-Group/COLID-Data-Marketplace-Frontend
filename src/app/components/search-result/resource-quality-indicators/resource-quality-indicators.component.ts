import { Component, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-resource-quality-indicators',
  standalone: true,
  imports: [MatTooltipModule, SharedModule],
  templateUrl: './resource-quality-indicators.component.html',
  styleUrl: './resource-quality-indicators.component.scss'
})
export class ResourceQualityIndicatorsComponent {
  @Input() brokenDistributionEndpoints: string[] | undefined;
  @Input() brokenContacts: string[] | undefined;
  @Input() nextReviewIsDue: boolean | undefined;

  get showBrokenDistributionEndpoints(): boolean {
    return this.brokenDistributionEndpoints?.length > 0;
  }

  get showBrokenContacts(): boolean {
    return this.brokenContacts?.length > 0;
  }

  get showNextReviewIsDue(): boolean {
    return this.nextReviewIsDue != null && this.nextReviewIsDue;
  }

  get showValidReviewCycle(): boolean {
    return this.nextReviewIsDue != null && !this.nextReviewIsDue;
  }
}
