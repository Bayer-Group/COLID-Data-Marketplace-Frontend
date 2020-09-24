import { SwUpdate } from '@angular/service-worker';
import { Injectable } from '@angular/core';

@Injectable()
export class PromptUpdateService {
  constructor(updates: SwUpdate) {
    if (updates.isEnabled) {
      updates.available.subscribe(event => {
        updates.activateUpdate().then(() => {
          document.location.reload();
        });
      });
    }
  }
}
