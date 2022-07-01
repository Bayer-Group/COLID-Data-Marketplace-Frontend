export const IDENT_PROV = 'IdentityProvider';

export const Constants = {
  ResourceTypes: {
    ConsumerGroup: 'https://pid.bayer.com/kos/19050#ConsumerGroup'
  },
  ConsumerGroup: {
    HasPidUriTemplate: 'https://pid.bayer.com/kos/19050#hasPidUriTemplate'
  },
  Authentication: {
    Roles: {
      Administration: 'DMP.Administration.ReadWrite'
    }
  },
  Logging: {
    Product: 'DMP',
    Layer: 'Frontend(Angular)',
  },
  Search: {
    DidYouMeanField: 'hasResourceDefinition.value'
  },
  Shacl: {
    Group: 'http://www.w3.org/ns/shacl#group',
    Groups: {
      LinkTypes: 'http://pid.bayer.com/kos/19050/LinkTypes'
    },
    Name: 'http://www.w3.org/ns/shacl#name',
    Order: 'http://www.w3.org/ns/shacl#order',
    Taxonomy: 'taxonomy'
  },
  Resource: {
    // For Resource Id
    Prefix: 'https://pid.bayer.com/kos/19050#',
    LifeCycleStatus: {
      Draft: 'https://pid.bayer.com/kos/19050/draft',
      Published: 'https://pid.bayer.com/kos/19050/published',
      Historic: 'https://pid.bayer.com/kos/19050/historic',
      MarkedDeletion: 'https://pid.bayer.com/kos/19050/markedForDeletion'
    },
    Groups: {
      InvisibleTechnicalInformation: 'http://pid.bayer.com/kos/19050/InvisibleTechnicalInformation',
      TechnicalInformation: 'https://pid.bayer.com/kos/19050/TechnicalInformation',
      LinkTypes: 'http://pid.bayer.com/kos/19050/LinkTypes',
      DistributionEndpoints: 'http://pid.bayer.com/kos/19050/DistributionEndpoints'
    }
  },
  Metadata: {
    Author: 'https://pid.bayer.com/kos/19050/author',
    HasDraftVersion: 'https://pid.bayer.com/kos/19050/hasDraftVersion',
    HasPublishedVersion: 'https://pid.bayer.com/kos/19050/hasPublishedVersion',
    Type: {
      Decimal: 'http://www.w3.org/2001/XMLSchema#decimal',
      Boolean: 'http://www.w3.org/2001/XMLSchema#boolean',
      DateTime: 'http://www.w3.org/2001/XMLSchema#dateTime',
      String: 'http://www.w3.org/2001/XMLSchema#string'
    },
    NodeType: {
      IRI: 'http://www.w3.org/ns/shacl#IRI',
      Literal: 'http://www.w3.org/ns/shacl#IRI'
    },
    EntityType: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
    Datatype: 'http://www.w3.org/ns/shacl#datatype',
    Comment: 'http://www.w3.org/2000/01/rdf-schema#comment',
    HasLabel: 'https://pid.bayer.com/kos/19050/hasLabel',
    HasBaseUri: 'https://pid.bayer.com/kos/19050/hasBaseURI',
    HasResourceDefinition: 'https://pid.bayer.com/kos/19050/hasResourceDefinition',
    HasPIDEditorialNote: 'https://pid.bayer.com/kos/19050/hasPIDEditorialNote',
    DateCreated: 'https://pid.bayer.com/kos/19050/dateCreated',
    LastChangeDateTime: 'https://pid.bayer.com/kos/19050/lastChangeDateTime',
    HasConsumerGroup: 'https://pid.bayer.com/kos/19050#hasConsumerGroup',
    HasLastChangeUser: 'https://pid.bayer.com/kos/19050/lastChangeUser',
    HasVersion: 'https://pid.bayer.com/kos/19050/hasVersion',
    HasPidUri: 'http://pid.bayer.com/kos/19014/hasPID',
    HasTargetUri: 'http://pid.bayer.com/kos/19014/hasNetworkAddress',
    PidUriTemplateIdType: 'https://pid.bayer.com/kos/19050#hasPidUriTemplateIdType',
    PidUriTemplateSuffix: 'https://pid.bayer.com/kos/19050#hasPidUriTemplateSuffix',
    DistributionEndpointLifecycleStatus: 'https://pid.bayer.com/kos/19050/hasDistributionEndpointLifecycleStatus',
    ContactPerson: 'https://pid.bayer.com/kos/19050/hasContactPerson',
    HasNetworkedResourceLabel: 'https://pid.bayer.com/kos/19050/hasNetworkedResourceLabel',
    HasDataCategory: 'https://pid.bayer.com/kos/19050/hasDataCategory',
    HasCountryContext : 'https://pid.bayer.com/kos/19050/hasCountryContext',
    RDFS: {
      Range: 'http://www.w3.org/2000/01/rdf-schema#range'
    },
    DataSteward: 'https://pid.bayer.com/kos/19050/hasDataSteward'
  },
  Identifier: {
    Type: 'http://pid.bayer.com/kos/19014/PermanentIdentifier'
  },
  DistributionEndpoint: {
    LifecycleStatus: {
      Active: 'https://pid.bayer.com/kos/19050/active'
    }
  }
};
