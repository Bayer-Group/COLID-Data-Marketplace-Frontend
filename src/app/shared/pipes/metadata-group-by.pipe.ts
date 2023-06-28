import { Pipe, PipeTransform } from "@angular/core";
import { MetaDataProperty } from "../models/metadata/meta-data-property";
import { MetaDataPropertyGroup } from "../models/metadata/meta-data-property-group";
import { Constants } from "src/app/shared/constants";

@Pipe({
  name: "groupByGroup",
})
export class MetadataGroupByPipe implements PipeTransform {
  transform(collection: Array<MetaDataProperty>): Array<any> {
    // prevents the application from breaking if the array of objects doesn't exist yet
    if (!collection) {
      return null;
    }

    const groupedCollection = collection.reduce((previous, current) => {
      const group: MetaDataPropertyGroup =
        current.properties[Constants.Metadata.Group];

      const groupKey = group ? group.key : "default";

      if (!previous[groupKey]) {
        previous[groupKey] = [current];
      } else {
        previous[groupKey].push(current);
      }

      return previous;
    }, {});

    // this will return an array of objects, each object containing a group of objects
    return Object.keys(groupedCollection).map((key) => ({
      key,
      value: groupedCollection[key],
    }));
  }
}
