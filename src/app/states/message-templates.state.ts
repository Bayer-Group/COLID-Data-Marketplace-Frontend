import { Injectable } from '@angular/core';
import { Selector, State, StateContext, Action } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { MessageTemplateApiService } from '../modules/admin/services/message-template.api.service';
import { MessageTemplate } from '../shared/models/message-template/message-template';

export class FetchMessageTemplates {
  static readonly type = '[MessageTemplate] Fetch message templates';
  constructor() {}
}

export class UpdateMessageTemplate {
  static readonly type = '[MessageTemplate] Update message template';
  constructor(public str: MessageTemplate) {}
}

export class MessageTemplateStateModel {
  messageTemplates: MessageTemplate[];
}

@State<MessageTemplateStateModel>({
  name: 'MessageTemplates',
  defaults: {
    messageTemplates: null
  }
})
@Injectable()
export class MessageTemplateState {
  constructor(private messageTemplateApiService: MessageTemplateApiService) {}

  @Selector()
  public static getMessageTemplates(state: MessageTemplateStateModel) {
    return state.messageTemplates;
  }

  @Action(UpdateMessageTemplate)
  UpdateMessageTemplate(
    ctx: StateContext<MessageTemplateStateModel>,
    action: UpdateMessageTemplate
  ) {
    return this.messageTemplateApiService
      .updateMessageTemplate(action.str)
      .pipe(
        tap((_: MessageTemplate) => {
          ctx.patchState({
            // TODO CK: how to patch only one entry
            // messageTemplates: res
          });
        })
      );
  }

  @Action(FetchMessageTemplates)
  FetchMessageTemplates(
    { patchState }: StateContext<MessageTemplateStateModel>,
    {}: FetchMessageTemplates
  ) {
    return this.messageTemplateApiService.getMessageTemplates().pipe(
      tap((res: MessageTemplate[]) => {
        patchState({
          messageTemplates: res
        });
      })
    );
  }
}
