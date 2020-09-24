import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable()
export class CheckForUpdateService {
  constructor(appRef: ApplicationRef, updates: SwUpdate) {
    if (updates.isEnabled) {
      // Allow the app to stabilize first, before starting polling for updates with `interval()`.
      const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
      const everyFiveMinutes$ = interval(5 * 60 * 1000);
      const everyFiveMinutesOnceAppIsStable$ = concat(appIsStable$, everyFiveMinutes$);

      everyFiveMinutesOnceAppIsStable$.subscribe(() => {
        updates.checkForUpdate();
      });
    }
  }
}
