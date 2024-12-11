import { Constants } from 'src/app/shared/constants';

export const FieldTypeMapping = {
  'http://www.w3.org/2001/XMLSchema#dateTime': 'datetime',
  'http://www.w3.org/2001/XMLSchema#boolean': 'boolean',
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#HTML': 'html',
  'http://www.w3.org/2001/XMLSchema#float': 'number',
  'http://www.w3.org/2001/XMLSchema#decimal': 'number'
};

export const MetaDataPropertyIdentifier = {
  targetUri: Constants.Metadata.HasTargetUri,
  pidUri: Constants.Metadata.HasPidUri,
  baseUri: Constants.Metadata.HasBaseUri
};
