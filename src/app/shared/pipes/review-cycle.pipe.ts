import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reviewCycle'
})
export class ReviewCyclePipe implements PipeTransform {

  transform(value: number): string {
    switch (value) {
      case 1:
        return 'Monthly';
      case 3:
        return 'Quarterly';
      case 12:
        return '1 year';
      default:
        return `${value} months`;
    }
  }

}
