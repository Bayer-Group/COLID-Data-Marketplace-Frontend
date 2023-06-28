import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { BroadcastMessage } from "src/app/shared/models/broadcast-message/broadcast-message";

@Injectable({
  providedIn: "root",
})
export class MessagesApiService {
  constructor(private httpClient: HttpClient) {}

  createBroadcastMessage(
    subject: string,
    body: string
  ): Observable<BroadcastMessage> {
    const url = `${environment.appDataApiUrl}/Messages/broadcastMessage`;
    return this.httpClient.post<BroadcastMessage>(
      url,
      new BroadcastMessage(subject, body)
    );
  }
}
