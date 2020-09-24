import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageDto } from 'src/app/shared/models/user/message-dto';

@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public notification: MessageDto) { }

  ngOnInit(): void {
  }

}
