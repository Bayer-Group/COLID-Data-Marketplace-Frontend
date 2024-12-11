import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-colid-spinner',
  templateUrl: './colid-spinner.component.html',
  styleUrls: ['./colid-spinner.component.css']
})
export class ColidSpinnerComponent implements OnInit {
  @Input() diameter: Number = 100;
  @Input() strokeWidth: Number = 5;

  matDiameter: Number;
  matStrokeWidth: Number;

  ngOnInit() {
    this.matDiameter = this.diameter;
    this.matStrokeWidth = this.strokeWidth;
  }
}
