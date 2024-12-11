import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Provides a centralized way to unsubscribe to reduce repeatedly writing this boilerplate code.
 * Unsubscription of observables when the component or directive is destroyed helps prevent memory leaks.
 *
 * @example
 * 1) Add as _extends_ to the component or directive:
 * ```typescript
 *    export class SomeComponent extends SubscriptionHelperDirective
 * ```
 *
 * 2) Use within a takeUntil operator before subscription:
 * ```typescript
 *    this.someService.someObservable$
 *       // Next line will trigger the unsubscribe when the component is destroyed
 *       .pipe(takeUntil(this._unsubscribe))
 *       .subscribe((someValue) => {
 *         this.someVariable = someValue;
 *       });
 * ```
 *
 * @see {@link https://angular.io/guide/lifecycle-hooks#ondestroy OnDestroy}
 */
@Directive({
  standalone: true
})
export class SubscriptionHelperDirective implements OnDestroy {
  protected _unsubscribe: Subject<void> = new Subject();

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }
}
