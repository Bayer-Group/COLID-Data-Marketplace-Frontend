import { Observable, of as observableOf } from 'rxjs';
import { LogPublisher } from './publishers/log-publisher';
import { EdmLogEntry } from '../../shared/models/logging/edm-log-entry';
import { LogLevel } from 'src/app/shared/models/logging/log-level';

export class LogConsole implements LogPublisher {
  log(_logLevel: LogLevel, _entry: EdmLogEntry): Observable<boolean> {
    return observableOf(true);
  }

  clear(): Observable<boolean> {
    console.clear();
    return observableOf(true);
  }
}
