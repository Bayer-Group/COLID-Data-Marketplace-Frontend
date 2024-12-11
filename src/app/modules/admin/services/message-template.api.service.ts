import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageTemplate } from 'src/app/shared/models/message-template/message-template';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageTemplateApiService {
  constructor(private httpClient: HttpClient) {}

  getMessageTemplates(): Observable<MessageTemplate[]> {
    const url = environment.appDataApiUrl + '/messageTemplates';
    return this.httpClient.get<MessageTemplate[]>(url);
  }

  updateMessageTemplate(content: MessageTemplate): Observable<MessageTemplate> {
    const url = environment.appDataApiUrl + '/messageTemplates';
    const jsonContent = JSON.stringify(content);
    return this.httpClient.put<MessageTemplate>(url, jsonContent);
  }
}
