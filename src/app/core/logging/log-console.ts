import { Observable, of as observableOf } from 'rxjs';
import { LogPublisher } from './publishers/log-publisher';
import { EdmLogEntry } from '../../shared/models/logging/edm-log-entry';
import { LogLevel } from 'src/app/shared/models/logging/log-level';

export class LogConsole implements LogPublisher {

    log(logLevel: LogLevel, entry: EdmLogEntry): Observable<boolean> {
        console.log(entry);
        return observableOf(true);
    }

    clear(): Observable<boolean> {
        console.clear();
        return observableOf(true);
    }
}
