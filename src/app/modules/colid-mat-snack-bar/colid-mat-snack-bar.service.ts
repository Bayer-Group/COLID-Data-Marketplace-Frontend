import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ColidMatSnackBarComponent } from './colid-mat-snack-bar/colid-mat-snack-bar.component';
import { ColidMatSnackBarData } from './colid-mat-snack-bar-data.model';
import { ColidMatSnackBarType } from './colid-mat-snack-bar-type.model';

@Injectable({
  providedIn: 'root'
})
export class ColidMatSnackBarService {
  constructor(private snackbar: MatSnackBar) {}

  clear() {
    this.snackbar.dismiss();
  }

  error(header: string, message: string, data: any = null) {
    this.openSnackbar(
      header,
      message,
      data,
      'error-snackbar',
      ColidMatSnackBarType.ERROR,
      8000
    );
  }

  warning(header: string, message: string, data: any = null) {
    this.openSnackbar(
      header,
      message,
      data,
      'warning-snackbar',
      ColidMatSnackBarType.WARNING,
      4000
    );
  }

  success(
    header: string,
    message: string,
    data: any = null,
    duration: number = 2000
  ) {
    this.openSnackbar(
      header,
      message,
      data,
      'success-snackbar',
      ColidMatSnackBarType.SUCCESS,
      duration
    );
  }
  successCustomDuration(
    header: string,
    message: string,
    data: any = null,
    duration: number
  ) {
    this.openSnackbar(
      header,
      message,
      data,
      'success-snackbar',
      ColidMatSnackBarType.SUCCESS,
      duration
    );
  }

  info(header: string, message: string, data: any = null, duration = 2000) {
    this.openSnackbar(
      header,
      message,
      data,
      'info-snackbar',
      ColidMatSnackBarType.INFO,
      duration
    );
  }

  private openSnackbar(
    header: string,
    message: string,
    data: any,
    panelClass: string,
    type: ColidMatSnackBarType,
    duration: number = undefined
  ) {
    this.snackbar.openFromComponent(ColidMatSnackBarComponent, {
      duration: duration,
      verticalPosition: 'top',
      horizontalPosition: 'end',
      panelClass: [panelClass],
      data: new ColidMatSnackBarData(header, message, data, type)
    });
  }
}
