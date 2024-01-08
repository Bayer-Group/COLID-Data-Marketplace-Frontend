import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  Inject,
  ChangeDetectorRef,
} from "@angular/core";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatDateFormats,
} from "@angular/material/core";
import { MatCalendar } from "@angular/material/datepicker";
import { Subject, takeUntil } from "rxjs";
import moment from "moment";
import { AppMaterialModule } from "src/app/app-material.module";

/** Custom header component for datepicker. */
@Component({
  selector: "custom-header-with-today-button",
  styles: [
    `
      .custom-header {
        display: flex;
        align-items: center;
        padding: 0.5em;
      }

      .custom-header-label {
        flex: 1;
        height: 1em;
        font-weight: 500;
        text-align: center;
      }
    `,
  ],
  template: `
    <div class="custom-header">
      <button mat-icon-button (click)="previousClicked('year')">
        <mat-icon>keyboard_double_arrow_left</mat-icon>
      </button>
      <button mat-icon-button (click)="previousClicked('month')">
        <mat-icon>keyboard_arrow_left</mat-icon>
      </button>
      <span class="custom-header-label">{{ periodLabel }}</span>
      <button mat-icon-button (click)="nextClicked('month')">
        <mat-icon>keyboard_arrow_right</mat-icon>
      </button>
      <button mat-icon-button (click)="nextClicked('year')">
        <mat-icon>keyboard_double_arrow_right</mat-icon>
      </button>
      <button mat-raised-button (click)="setTodayDate()">Today</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AppMaterialModule],
})
export class DatePickerCustomHeaderWithTodayButtonComponent
  implements OnDestroy
{
  private _destroyed = new Subject<void>();

  constructor(
    private _calendar: MatCalendar<moment.Moment>,
    private _dateAdapter: DateAdapter<moment.Moment>,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
    cdr: ChangeDetectorRef
  ) {
    _calendar.stateChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => cdr.markForCheck());
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  setTodayDate() {
    this._calendar.activeDate = moment();
  }

  get periodLabel() {
    return this._dateAdapter
      .format(
        this._calendar.activeDate,
        this._dateFormats.display.monthYearLabel
      )
      .toLocaleUpperCase();
  }

  previousClicked(mode: "month" | "year") {
    this._calendar.activeDate =
      mode === "month"
        ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1)
        : this._dateAdapter.addCalendarYears(this._calendar.activeDate, -1);
  }

  nextClicked(mode: "month" | "year") {
    this._calendar.activeDate =
      mode === "month"
        ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1)
        : this._dateAdapter.addCalendarYears(this._calendar.activeDate, 1);
  }
}
