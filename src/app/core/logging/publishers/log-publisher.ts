import { Observable } from "rxjs";
import { EdmLogEntry } from "../../../shared/models/logging/edm-log-entry";
import { LogLevel } from "src/app/shared/models/logging/log-level";

export interface LogPublisher {
  log(logLevel: LogLevel, record: EdmLogEntry): Observable<boolean>;
  clear(): Observable<boolean>;
}
