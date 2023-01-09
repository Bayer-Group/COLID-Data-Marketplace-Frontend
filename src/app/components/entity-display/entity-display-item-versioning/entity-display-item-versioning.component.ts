import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: "app-entity-display-item-versioning",
  templateUrl: "./entity-display-item-versioning.component.html",
  styleUrls: ["./entity-display-item-versioning.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityDisplayItemVersioningComponent implements OnInit {
  @Input() versions: any[];
  @Input() version: string;

  constructor() {}

  ngOnInit(): void {}
}
