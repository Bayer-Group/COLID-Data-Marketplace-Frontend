import { Component, Input } from '@angular/core';
import { LogService } from 'src/app/core/logging/log.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent {
  @Input() payload: object;
  @Input() feature: string;

  isFeedbackPageVisible: boolean = true;
  iSentimentalScorePositive: boolean = null;
  comment: string = '';
  isCommentShown: boolean = false;

  logMessage = 'dmp-feedback-component';

  constructor(private logService: LogService) {}

  selectSentimental(score: boolean) {
    this.iSentimentalScorePositive = score;
    this.isCommentShown = true;
  }

  sendFeedback() {
    this.isFeedbackPageVisible = false;
    this.logService.info(this.logMessage, {
      feature: this.feature,
      payload: this.payload,
      sentimental_score: this.iSentimentalScorePositive,
      comment: this.comment
    });
  }
}
