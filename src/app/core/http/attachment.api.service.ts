import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttachmentDto } from 'src/app/shared/models/attachment/attachment-dto';

@Injectable({
  providedIn: 'root'
})
export class AttachmentApiService {
  regex_attachment_id: RegExp = new RegExp(
    /^(.*)([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\/(.*)$/
  );

  constructor(private httpClient: HttpClient) {}

  uploadAttachment(fileToUpload: File, comment): Observable<AttachmentDto> {
    const url = `${environment.colidApiUrl}/attachment`;

    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    const httpOptions = {
      // When uploading files, the content type must not be set at all,
      // so that the browser can choose the correct content type depending on the file type.
      headers: new HttpHeaders().set('x-skip-content-type', ''),
      params: { comment: comment }
    };

    return this.httpClient.post<AttachmentDto>(url, formData, httpOptions);
  }

  deleteAttachment(attachmentId: string): Observable<any> {
    const url = `${environment.colidApiUrl}/attachment`;
    let guidFileName = this.splitAttachemendId(attachmentId);

    const httpOptions = {
      params: {
        guid: guidFileName[0],
        fileName: guidFileName[1]
      }
    };

    return this.httpClient.delete(url, httpOptions);
  }

  private splitAttachemendId(attachmentId: string): [string, string] {
    let result = this.regex_attachment_id.exec(attachmentId);
    return [result[2], result[3]];
  }
}
