import { MetaDataProperty } from "./meta-data-property";

export interface Metadata {
  key: string;
  label: string;
  description: string;
  properties: MetaDataProperty[];
}