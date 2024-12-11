import { Constants } from 'src/app/shared/constants';

export const FieldTypeFormItemMapping = {
  [Constants.Shacl.String]: 'general',
  [Constants.Shacl.NaturalNumber]: 'number',
  [Constants.Shacl.Number]: 'number',
  [Constants.Shacl.DateTime]: 'datetime',
  [Constants.Shacl.HTML]: 'html',
  [Constants.Shacl.Boolean]: 'boolean',
  [Constants.Shacl.List]: 'list',
  [Constants.Shacl.ExtendableList]: 'extendableList',
  [Constants.Shacl.Hierarchy]: 'taxonomy',
  [Constants.Shacl.Identifier]: 'identifier',
  [Constants.Shacl.Entity]: 'nested',
  [Constants.Shacl.Attachment]: 'attachment',
  [Constants.Shacl.LinkedEntity]: 'linking',
  [Constants.Shacl.Person]: 'person'
};
