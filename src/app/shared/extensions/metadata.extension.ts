import { Constants } from "../constants";
import { MetaDataProperty } from "../models/metadata/meta-data-property";
import { MetaDataPropertyGroup } from "../models/metadata/meta-data-property-group";

export class MetadataExtension {
  public static isInvisbleGroupKey(key: string): boolean {
    return key === Constants.Resource.Groups.InvisibleTechnicalInformation;
  }

  public static isIgnoredProperty(metaDataProperty: MetaDataProperty) {
    return this.isInvisbleGroup(metaDataProperty);
  }

  private static isInvisbleGroup(metaDataProperty: MetaDataProperty): boolean {
    const group: MetaDataPropertyGroup =
      metaDataProperty.properties[Constants.Metadata.Group];

    return group && this.isInvisbleGroupKey(group.key);
  }
}
