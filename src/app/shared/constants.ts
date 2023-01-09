export const IDENT_PROV = 'IdentityProvider';

export const Constants = {
  ResourceTypes: {
    ConsumerGroup: "https://pid.bayer.com/kos/19050#ConsumerGroup",
  },
  ConsumerGroup: {
    HasPidUriTemplate: "https://pid.bayer.com/kos/19050#hasPidUriTemplate",
  },
  Authentication: {
    Roles: {
      Administration: "DMP.Administration.ReadWrite",
    },
    EditorRoles: {
      Administration: "COLID.Administration.ReadWrite",
      SuperAdministration: "COLID.Superadministration.ReadWrite",
    },
  },
  Logging: {
    Product: "DMP",
    Layer: "Frontend(Angular)",
  },
  Search: {
    DidYouMeanField: "hasResourceDefinition.value",
  },
  OWL: {
    Class: "http://www.w3.org/2002/07/owl#Class",
  },
  Shacl: {
    Group: "http://www.w3.org/ns/shacl#group",
    Groups: {
      LinkTypes: "http://pid.bayer.com/kos/19050/LinkTypes",
    },
    Name: "http://www.w3.org/ns/shacl#name",
    Order: "http://www.w3.org/ns/shacl#order",
    Taxonomy: "taxonomy",
    Comment: "http://www.w3.org/2000/01/rdf-schema#comment",
    Description: "http://www.w3.org/ns/shacl#description",
  },
  Resource: {
    // For Resource Id
    Prefix: "https://pid.bayer.com/kos/19050#",
    LifeCycleStatus: {
      Draft: "https://pid.bayer.com/kos/19050/draft",
      Published: "https://pid.bayer.com/kos/19050/published",
      Historic: "https://pid.bayer.com/kos/19050/historic",
      MarkedDeletion: "https://pid.bayer.com/kos/19050/markedForDeletion",
    },
    Groups: {
      InvisibleTechnicalInformation:
        "http://pid.bayer.com/kos/19050/InvisibleTechnicalInformation",
      TechnicalInformation:
        "https://pid.bayer.com/kos/19050/TechnicalInformation",
      LinkTypes: "http://pid.bayer.com/kos/19050/LinkTypes",
      DistributionEndpoints:
        "http://pid.bayer.com/kos/19050/DistributionEndpoints",
      Images: "https://pid.bayer.com/kos/19050/AttachmentsPropertyGroup",
    },
  },
  Metadata: {
    Author: "https://pid.bayer.com/kos/19050/author",
    HasDraftVersion: "https://pid.bayer.com/kos/19050/hasDraftVersion",
    HasPublishedVersion: "https://pid.bayer.com/kos/19050/hasPublishedVersion",
    Type: {
      Decimal: "http://www.w3.org/2001/XMLSchema#decimal",
      Boolean: "http://www.w3.org/2001/XMLSchema#boolean",
      DateTime: "http://www.w3.org/2001/XMLSchema#dateTime",
      String: "http://www.w3.org/2001/XMLSchema#string",
    },
    NodeType: {
      IRI: "http://www.w3.org/ns/shacl#IRI",
      Literal: "http://www.w3.org/ns/shacl#IRI",
    },
    Name: "http://www.w3.org/ns/shacl#name",
    EntityType: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    Datatype: "http://www.w3.org/ns/shacl#datatype",
    Comment: "http://www.w3.org/2000/01/rdf-schema#comment",
    Group: "http://www.w3.org/ns/shacl#group",
    HasLabel: "https://pid.bayer.com/kos/19050/hasLabel",
    HasBaseUri: "https://pid.bayer.com/kos/19050/hasBaseURI",
    HasResourceDefinition:
      "https://pid.bayer.com/kos/19050/hasResourceDefinition",
    HasPIDEditorialNote: "https://pid.bayer.com/kos/19050/hasPIDEditorialNote",
    DateCreated: "https://pid.bayer.com/kos/19050/dateCreated",
    LastChangeDateTime: "https://pid.bayer.com/kos/19050/lastChangeDateTime",
    LastReviewDateTime: "https://pid.bayer.com/kos/19050/hasLastReviewDate",
    HasConsumerGroup: "https://pid.bayer.com/kos/19050#hasConsumerGroup",
    HasLastChangeUser: "https://pid.bayer.com/kos/19050/lastChangeUser",
    HasVersion: "https://pid.bayer.com/kos/19050/hasVersion",
    HasPidUri: "http://pid.bayer.com/kos/19014/hasPID",
    HasTargetUri: "http://pid.bayer.com/kos/19014/hasNetworkAddress",
    PidUriTemplateIdType:
      "https://pid.bayer.com/kos/19050#hasPidUriTemplateIdType",
    PidUriTemplateSuffix:
      "https://pid.bayer.com/kos/19050#hasPidUriTemplateSuffix",
    DistributionEndpointLifecycleStatus:
      "https://pid.bayer.com/kos/19050/hasDistributionEndpointLifecycleStatus",
    ContactPerson: "https://pid.bayer.com/kos/19050/hasContactPerson",
    HasNetworkedResourceLabel:
      "https://pid.bayer.com/kos/19050/hasNetworkedResourceLabel",
    HasDataCategory: "https://pid.bayer.com/kos/19050/hasDataCategory",
    HasCountryContext: "https://pid.bayer.com/kos/19050/hasCountryContext",
    HasNextReviewDueDate:
      "https://pid.bayer.com/kos/19050/hasNextReviewDueDate",
    HasReviewCyclePolicy:
      "https://pid.bayer.com/kos/19050/hasResourceReviewCyclePolicy",
    HasLastReviewer: "https://pid.bayer.com/kos/19050/hasLastReviewer",
    LifeCycleStatus: "https://pid.bayer.com/kos/19050/hasEntryLifecycleStatus",
    RDFS: {
      Range: "http://www.w3.org/2000/01/rdf-schema#range",
      Label: "http://www.w3.org/2000/01/rdf-schema#label",
    },
    HasAttachment: "https://pid.bayer.com/kos/19050/hasAttachment",
    DataSteward: "https://pid.bayer.com/kos/19050/hasDataSteward",
    NodeKind: "http://www.w3.org/ns/shacl#nodeKind",
    Keywords: "https://pid.bayer.com/kos/19050/47119343",
    ContainsTherapeuticAreas:
      "https://pid.bayer.com/d188c668-b710-45b2-9631-faf29e85ac8d/contains_information_about_therapeutic_area",
    ContainsRwdDimensions:
      "https://pid.bayer.com/d188c668-b710-45b2-9631-faf29e85ac8d/contains_rwd_dimension",
    MainDistribution: "https://pid.bayer.com/kos/19050/mainDistribution",
  },
  Identifier: {
    Type: "http://pid.bayer.com/kos/19014/PermanentIdentifier",
  },
  DistributionEndpoint: {
    LifecycleStatus: {
      Active: "https://pid.bayer.com/kos/19050/active",
    },
  },
};
