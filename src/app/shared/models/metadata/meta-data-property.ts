import { Metadata } from './meta-data';

export class MetaDataProperty {
  key: string;
  properties: Map<string, any>;
  nestedMetadata: Metadata[];
}
