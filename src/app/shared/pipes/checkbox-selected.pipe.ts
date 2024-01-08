import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "checkboxSelected",
})
export class CheckboxSelectedPipe implements PipeTransform {
  transform(value: string, selectedValues: string[]): unknown {
    const decodedValue = decodeURIComponent(value);
    return selectedValues.indexOf(decodedValue) > -1;
  }
}
