import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'utcToLocalTime'
})
export class UTCToLocalTimePipe implements PipeTransform {
  transform(value: any): any {
    if (value) {
      return new Date(value+"+00:00").toLocaleString();
    }
    return value;
  }

}
