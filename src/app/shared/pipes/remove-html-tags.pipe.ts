import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeHtml'
})
export class RemoveHtmlTagsPipe implements PipeTransform {
  transform(input: string): string {
    const regex = /(<([^>]+)>)/gi;
    return input.replace(regex, '');
  }
}
