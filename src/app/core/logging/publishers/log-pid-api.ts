import { HttpClient } from '@angular/common/http';
import { Observable, of as observableOf } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { LogPublisher } from './log-publisher';
import { EdmLogEntry } from '../../../shared/models/logging/edm-log-entry';
import { LogLevel } from 'src/app/shared/models/logging/log-level';

export class LogPidApi implements LogPublisher {
  location: string;

  constructor(private httpClient: HttpClient) {
    // Set location
    this.location = environment.loggingUrl;
  }

  // Add log entry to back end data store
  log(logLevel: LogLevel, entry: EdmLogEntry): Observable<boolean> {
    return this.httpClient.post(this.location + '/' + logLevel, entry).pipe(
      map((response) => response),
      catchError(this.handleErrors)
    );
  }

  // Clear all log entries from local storage
  clear(): Observable<boolean> {
    // TODO: Call Web API to clear all values
    return observableOf(true);
  }

  private handleErrors(error: any): Observable<any> {
    return observableOf(error);
    // return throwError(error);
  }
}
