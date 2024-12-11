import { ErrorHandler, Injector, Injectable } from '@angular/core';
import { LogService } from './log.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any) {
    const logger = this.injector.get(LogService);
    const message = error.message ? error.message : error.toString();
    logger.error(message, error);

    // IMPORTANT: Rethrow the error otherwise it gets swallowed
    throw error;
  }
}
