import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lastIndexString'
})
export class LastIndexStringPipe implements PipeTransform {
  transform(value: any): any {
    return value?.slice(value.lastIndexOf('/') + 1, value.length);
  }
}
