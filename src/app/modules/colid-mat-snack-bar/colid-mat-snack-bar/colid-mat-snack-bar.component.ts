import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { ColidMatSnackBarData } from '../colid-mat-snack-bar-data.model';
import { ColidMatSnackBarType } from '../colid-mat-snack-bar-type.model';

@Component({
  selector: 'app-colid-mat-snack-bar',
  templateUrl: './colid-mat-snack-bar.component.html',
  styleUrls: ['./colid-mat-snack-bar.component.css']
})
export class ColidMatSnackBarComponent implements OnInit {

  colidSnackBarType = ColidMatSnackBarType;

  constructor(public snackbarref: MatSnackBarRef<ColidMatSnackBarComponent>, private zone: NgZone, @Inject(MAT_SNACK_BAR_DATA) public data: ColidMatSnackBarData) { }

  ngOnInit() {
  }

  copy() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = JSON.stringify(this.data.data);
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  dismiss() {
    this.zone.run(() => {
      this.snackbarref.dismiss()
    });
  }
}
