import { ColidMatSnackBarType } from './colid-mat-snack-bar-type.model';

export class ColidMatSnackBarData {
  header: string;
  message: string;
  data: any;
  type: ColidMatSnackBarType

  constructor(header: string, message: string, data: any, type: ColidMatSnackBarType){
    this.header = header;
    this.message = message;
    this.data = data;
    this.type = type;
  }
}
