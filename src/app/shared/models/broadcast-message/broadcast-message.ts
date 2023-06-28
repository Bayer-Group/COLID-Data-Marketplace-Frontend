export class BroadcastMessage {
  subject: string;
  body: string;

  public constructor(subject: string, body: string) {
    this.subject = subject;
    this.body = body;
  }
}
