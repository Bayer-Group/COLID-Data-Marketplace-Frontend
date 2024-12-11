import { Component, Input } from '@angular/core';

// TODO: Unify - duplicate code with colid-ui-editor-frontend

@Component({
  selector: 'action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent {
  @Input() type: 'mat-raised-button' | 'mat-icon-button' = 'mat-raised-button';
  @Input() fontSet: 'material-icons-outlined' | 'material-icons' =
    'material-icons-outlined';
  @Input() color: string = 'primary';
  @Input() disabled: boolean = false;
  @Input() icon: string;
  @Input() loading: boolean = false;
}
