export class MessageConfigDto {
  sendInterval: string;
  deleteInterval: string;

  constructor(sendInterval: string, deleteInterval: string) {
    this.sendInterval = sendInterval;
    this.deleteInterval = deleteInterval;
  }
}
