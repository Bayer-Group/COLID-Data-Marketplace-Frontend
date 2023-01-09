import { Metadata } from "./meta-data";

export interface MetaDataProperty {
    key: string;
    properties: Map<string, any>;
    nestedMetadata: Metadata[];
}