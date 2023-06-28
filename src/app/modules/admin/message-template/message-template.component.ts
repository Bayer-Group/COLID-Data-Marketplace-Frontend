import { Component, OnInit, OnDestroy } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable, Subscription } from "rxjs";
import { MessageTemplate } from "src/app/shared/models/message-template/message-template";
import {
  MessageTemplateState,
  FetchMessageTemplates,
} from "src/app/states/message-templates.state";

@Component({
  selector: "app-message-template",
  templateUrl: "./message-template.component.html",
  styleUrls: ["./message-template.component.css"],
})
export class MessageTemplateComponent implements OnInit, OnDestroy {
  @Select(MessageTemplateState.getMessageTemplates)
  messageTemplates$: Observable<Array<MessageTemplate>>;

  constructor(private store: Store) {}

  messageTemplatesSubscription: Subscription;

  ngOnInit() {
    this.loadMessageTemplates();
  }

  loadMessageTemplates() {
    this.messageTemplatesSubscription = this.store
      .dispatch(new FetchMessageTemplates())
      .subscribe();
  }

  ngOnDestroy() {
    this.messageTemplatesSubscription.unsubscribe();
  }
}
