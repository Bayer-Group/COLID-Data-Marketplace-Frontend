export class AttachmentUploadedDto {
  oldTemporaryId: string;
  newAttachmentId: string;

  constructor(oldTemporaryId: string, newAttachmentId: string) {
    this.oldTemporaryId = oldTemporaryId;
    this.newAttachmentId = newAttachmentId;
  }
}
