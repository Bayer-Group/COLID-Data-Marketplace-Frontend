import { Constants } from "src/app/shared/constants";

export const FieldTypeMapping = {
  [Constants.Metadata.Type.DateTime]: "datetime",
  [Constants.Metadata.Type.Boolean]: "boolean",
  [Constants.Metadata.Type.HTML]: "html",
  [Constants.Metadata.Type.Float]: "number",
  [Constants.Metadata.Type.Decimal]: "number",
};

export const MetaDataPropertyIdentifier = {
  targetUri: Constants.Metadata.HasTargetUri,
  pidUri: Constants.Metadata.HasPidUri,
  baseUri: Constants.Metadata.HasBaseUri,
};
