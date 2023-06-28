import { Entity } from "../entities/entity";
import { LinkingMapping } from "./linking-mapping";
import { VersionProperty } from "./version-property";

export class Resource extends Entity {
  pidUri: string;
  baseUri: string;
  previousVersion: VersionProperty;
  laterVersion: VersionProperty;
  //links: { [id: string] : LinkingMapping[]; };
  links: Map<string, LinkingMapping[]>;
  publishedVersion: string;
  versions: VersionProperty[];
  isMarkedDeleted: boolean;

  constructor() {
    super();
  }
}
