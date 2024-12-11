import {
  Directive,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil, distinctUntilChanged } from 'rxjs/operators';

@Directive({
  selector: '[debounce]'
})
export class DebounceDirective implements OnInit, OnDestroy {
  @Output()
  public debounceHandler = new EventEmitter<any>();

  @Input('debounce')
  public debounceTime = 500;

  private isFirstChange = true;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(public model: NgControl) {}

  ngOnInit() {
    this.model.valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe),
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
      .subscribe((modelValue) => {
        if (this.isFirstChange) {
          this.isFirstChange = false;
        } else {
          this.debounceHandler.emit(modelValue);
        }
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
