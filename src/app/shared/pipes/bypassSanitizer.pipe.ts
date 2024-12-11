import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'bypassSanitizer'
})
export class BypassSanitizerPipe implements PipeTransform {
  constructor(protected sanitizer: DomSanitizer) {}

  public transform(value: string): SafeHtml {
    var safeValue = this.sanitizer.bypassSecurityTrustHtml(value);
    return safeValue;
  }
}
