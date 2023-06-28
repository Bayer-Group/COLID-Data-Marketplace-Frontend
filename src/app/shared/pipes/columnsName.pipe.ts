import { Pipe, PipeTransform } from "@angular/core";
import { Constants } from "src/app/shared/constants";

@Pipe({
  name: "columnsName",
})
export class ColumnsNamePipe implements PipeTransform {
  transform(input: string, table: any): string {
    if (table[input]) {
      return table[input].properties[Constants.Shacl.Name];
    }
    return "";
  }
}
