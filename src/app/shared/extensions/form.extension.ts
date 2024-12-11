import { MetaDataProperty } from '../models/metadata/meta-data-property';
import { Constants } from 'src/app/shared/constants';

export class FormExtension {
  public static createEntityPropertyList(
    formData: [string, any][],
    metaDataProperties: MetaDataProperty[]
  ): { [id: string]: any[] } {
    const entityProperties: { [id: string]: any[] } = {};

    for (const property of formData) {
      for (const m of metaDataProperties) {
        if (property[0] === m.properties[Constants.Metadata.HasPidUri]) {
          let propValue = Array.isArray(property[1])
            ? property[1]
            : [property[1]];
          propValue = propValue.filter((value) => value != null);

          const entityPropertyValue: any[] = propValue.map((value) => {
            if (value.id != null || value.properties != null) {
              return this.createPropertyValue(value, m, true);
            } else if (
              value.constructor === String ||
              value.constructor === Number
            ) {
              return this.createPropertyValue(value, m, false);
            } else {
              return this.createPropertyValue(value.key, m, false);
            }
          });
          entityProperties[property[0]] = entityPropertyValue;
        }
      }
    }
    return entityProperties;
  }

  private static createPropertyValue(
    value: any,
    metadata: MetaDataProperty,
    isObject: boolean
  ): any {
    return value != null && !isObject ? value.toString().trim() : value;
  }
}
