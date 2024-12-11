import { AmazonS3FileUploadInfoDto } from './amazon-s3-file-upload-info-dto';

export class AttachmentDto {
  id: string;
  s3File: AmazonS3FileUploadInfoDto;
}
