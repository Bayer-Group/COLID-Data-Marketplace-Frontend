export const IDENT_PROV = 'IdentityProvider';
import { environment } from 'src/environments/environment';

export const Constants = {
  ResourceTypes: {
    ConsumerGroup: `https://pid.${environment.baseUrl}/kos/19050#ConsumerGroup`,
    MetadataGraphConfiguration: `https://pid.${environment.baseUrl}/kos/19050/367403`,
    Table: `https://pid.${environment.baseUrl}/kos/19050/444586`,
    Column: `https://pid.${environment.baseUrl}/kos/19050/444582`,
    Dataset: `https://pid.${environment.baseUrl}/kos/19050/NonRDFDataset`,
    PidUriTemplate: `https://pid.${environment.baseUrl}/kos/19050#PidUriTemplate`,
    ExtendedUriTemplate: `https://pid.${environment.baseUrl}/kos/19050#ExtendedUriTemplate`
  },
  ResourceTemplates: {
    Type: `https://pid.${environment.baseUrl}/kos/19050/ResourceTemplate`,
    HasResourceTemplates: `https://pid.${environment.baseUrl}/kos/19050/hasResourceTemplates`,
    HasResourceType: `https://pid.${environment.baseUrl}/kos/19050/hasResourceType`
  },
  ConsumerGroup: {
    HasPidUriTemplate: `https://pid.${environment.baseUrl}/kos/19050#hasPidUriTemplate`,
    HasDefaultPidUriTemplate: `https://pid.${environment.baseUrl}/kos/19050/hasDefaultPidUriTemplate`,
    HasDefaultReviewCyclePolicy: `https://pid.${environment.baseUrl}/kos/19050/hasDefaultReviewCyclePolicy`,
    HasConsumerGroupLifecycleStatus: `https://pid.${environment.baseUrl}/kos/19050/hasConsumerGroupLifecycleStatus`,
    LifecycleStatus: {
      Active: `https://pid.${environment.baseUrl}/kos/19050/active`,
      Deprecated: `https://pid.${environment.baseUrl}/kos/19050/deprecated`
    }
  },
  Authentication: {
    Roles: {
      Administration: 'DMP.Administration.ReadWrite'
    },
    EditorRoles: {
      Administration: 'COLID.Administration.ReadWrite',
      SuperAdministration: 'COLID.Superadministration.ReadWrite'
    }
  },
  Logging: {
    Product: 'DMP',
    Layer: 'Frontend(Angular)'
  },
  Search: {
    DidYouMeanField: 'hasResourceDefinition.value'
  },
  OWL: {
    Class: 'http://www.w3.org/2002/07/owl#Class',
    SubClass: 'http://www.w3.org/2000/01/rdf-schema#subClassOf'
  },
  Shacl: {
    DefaultValue: 'http://www.w3.org/ns/shacl#defaultValue',
    Severity: {
      Info: 'http://www.w3.org/ns/shacl#Info',
      Warning: 'http://www.w3.org/ns/shacl#Warning',
      Violation: 'http://www.w3.org/ns/shacl#Violation'
    },
    Group: 'http://www.w3.org/ns/shacl#group',
    Groups: {
      LinkTypes: `http://pid.${environment.baseUrl}/kos/19050/LinkTypes`
    },
    Name: 'http://www.w3.org/ns/shacl#name',
    Order: 'http://www.w3.org/ns/shacl#order',
    Taxonomy: 'taxonomy',
    Comment: 'http://www.w3.org/2000/01/rdf-schema#comment',
    Description: 'http://www.w3.org/ns/shacl#description',
    String: `https://pid.${environment.baseUrl}/ns/shacl/fieldType#string`,
    NaturalNumber: `https://pid.${environment.baseUrl}/ns/shacl/fieldType#naturalNumber`,
    Number: `https://pid.${environment.baseUrl}/ns/shacl/fieldType#number`,
    DateTime: `https://pid.${environment.baseUrl}/ns/shacl/fieldType#dateTime`,
    HTML: `https://pid.${environment.baseUrl}/ns/shacl/fieldType#html`,
    Boolean: `https://pid.${environment.baseUrl}/ns/shacl/fieldType#boolean`,
    List: `https://pid.${environment.baseUrl}/ns/shacl/fieldType#list`,
    ExtendableList: `https://pid.${environment.baseUrl}/ns/shacl/fieldType#extendableList`,
    Hierarchy: `https://pid.${environment.baseUrl}/ns/shacl/fieldType#hierarchy`,
    Identifier: `https://pid.${environment.baseUrl}/ns/shacl/fieldType#identifier`,
    Entity: `https://pid.${environment.baseUrl}/ns/shacl/fieldType#entity`,
    Attachment: `https://pid.${environment.baseUrl}/ns/shacl/fieldType#attachment`,
    LinkedEntity: `https://pid.${environment.baseUrl}/ns/shacl/fieldType#linkedEntity`,
    Person: `https://pid.${environment.baseUrl}/ns/shacl/fieldType#person`
  },
  Resource: {
    // For Resource Id
    Prefix: `https://pid.${environment.baseUrl}/kos/19050#`,
    LifeCycleStatus: {
      Draft: `https://pid.${environment.baseUrl}/kos/19050/draft`,
      Published: `https://pid.${environment.baseUrl}/kos/19050/published`,
      Historic: `https://pid.${environment.baseUrl}/kos/19050/historic`,
      MarkedDeletion: `https://pid.${environment.baseUrl}/kos/19050/markedForDeletion`
    },
    Groups: {
      InvisibleTechnicalInformation: `http://pid.${environment.baseUrl}/kos/19050/InvisibleTechnicalInformation`,
      TechnicalInformation: `https://pid.${environment.baseUrl}/kos/19050/TechnicalInformation`,
      LinkTypes: `http://pid.${environment.baseUrl}/kos/19050/LinkTypes`,
      DistributionEndpoints: `http://pid.${environment.baseUrl}/kos/19050/DistributionEndpoints`,
      Images: `https://pid.${environment.baseUrl}/kos/19050/AttachmentsPropertyGroup`
    }
  },
  Metadata: {
    Author: `https://pid.${environment.baseUrl}/kos/19050/author`,
    HasDraftVersion: `https://pid.${environment.baseUrl}/kos/19050/hasDraftVersion`,
    HasPublishedVersion: `https://pid.${environment.baseUrl}/kos/19050/hasPublishedVersion`,
    Type: {
      Decimal: 'http://www.w3.org/2001/XMLSchema#decimal',
      Boolean: 'http://www.w3.org/2001/XMLSchema#boolean',
      DateTime: 'http://www.w3.org/2001/XMLSchema#dateTime',
      String: 'http://www.w3.org/2001/XMLSchema#string',
      HTML: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#HTML',
      Float: 'http://www.w3.org/2001/XMLSchema#float'
    },
    NodeType: {
      IRI: 'http://www.w3.org/ns/shacl#IRI',
      Literal: 'http://www.w3.org/ns/shacl#IRI'
    },
    Name: 'http://www.w3.org/ns/shacl#name',
    EntityType: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
    Datatype: 'http://www.w3.org/ns/shacl#datatype',
    Comment: 'http://www.w3.org/2000/01/rdf-schema#comment',
    Group: 'http://www.w3.org/ns/shacl#group',
    ControlledVocabulary: `https://pid.${environment.baseUrl}/kos/19050#ControlledVocabulary`,
    Order: 'http://www.w3.org/ns/shacl#order',
    HasLabel: `https://pid.${environment.baseUrl}/kos/19050/hasLabel`,
    HasBaseUri: `https://pid.${environment.baseUrl}/kos/19050/hasBaseURI`,
    HasResourceDefinition: `https://pid.${environment.baseUrl}/kos/19050/hasResourceDefinition`,
    HasPIDEditorialNote: `https://pid.${environment.baseUrl}/kos/19050/hasPIDEditorialNote`,
    DateCreated: `https://pid.${environment.baseUrl}/kos/19050/dateCreated`,
    LastChangeDateTime: `https://pid.${environment.baseUrl}/kos/19050/lastChangeDateTime`,
    LastReviewDateTime: `https://pid.${environment.baseUrl}/kos/19050/hasLastReviewDate`,
    HasConsumerGroup: `https://pid.${environment.baseUrl}/kos/19050#hasConsumerGroup`,
    HasLastChangeUser: `https://pid.${environment.baseUrl}/kos/19050/lastChangeUser`,
    HasVersion: `https://pid.${environment.baseUrl}/kos/19050/hasVersion`,
    HasPidUri: `http://pid.${environment.baseUrl}/kos/19014/hasPID`,
    HasTargetUri: `http://pid.${environment.baseUrl}/kos/19014/hasNetworkAddress`,
    PidUriTemplateIdType: `https://pid.${environment.baseUrl}/kos/19050#PidUriTemplateIdType`,
    PidUriTemplateSuffix: `https://pid.${environment.baseUrl}/kos/19050#PidUriTemplateSuffix`,
    DistributionEndpointLifecycleStatus: `https://pid.${environment.baseUrl}/kos/19050/hasDistributionEndpointLifecycleStatus`,
    ContactPerson: `https://pid.${environment.baseUrl}/kos/19050/hasContactPerson`,
    HasNetworkedResourceLabel: `https://pid.${environment.baseUrl}/kos/19050/hasNetworkedResourceLabel`,
    HasDataCategory: `https://pid.${environment.baseUrl}/kos/19050/hasDataCategory`,
    HasCountryContext: `https://pid.${environment.baseUrl}/kos/19050/hasCountryContext`,
    HasNextReviewDueDate: `https://pid.${environment.baseUrl}/kos/19050/hasNextReviewDueDate`,
    HasReviewCyclePolicy: `https://pid.${environment.baseUrl}/kos/19050/hasResourceReviewCyclePolicy`,
    HasLastReviewer: `https://pid.${environment.baseUrl}/kos/19050/hasLastReviewer`,
    LifeCycleStatus: `https://pid.${environment.baseUrl}/kos/19050/hasEntryLifecycleStatus`,
    RDFS: {
      Range: 'http://www.w3.org/2000/01/rdf-schema#range',
      Label: 'http://www.w3.org/2000/01/rdf-schema#label'
    },
    HasAttachment: `https://pid.${environment.baseUrl}/kos/19050/hasAttachment`,
    DataSteward: `https://pid.${environment.baseUrl}/kos/19050/hasDataSteward`,
    NodeKind: 'http://www.w3.org/ns/shacl#nodeKind',
    Keywords: `https://pid.${environment.baseUrl}/kos/19050/47119343`,
    ContainsTherapeuticAreas: `https://pid.${environment.baseUrl}/d188c668-b710-45b2-9631-faf29e85ac8d/contains_information_about_therapeutic_area`,
    ContainsRwdDimensions: `https://pid.${environment.baseUrl}/d188c668-b710-45b2-9631-faf29e85ac8d/contains_rwd_dimension`,
    MainDistribution: `https://pid.${environment.baseUrl}/kos/19050/mainDistribution`,
    PIDClass: `https://pid.${environment.baseUrl}/kos/19050/PID_Concept`,
    BaseURIPointsAt: `https://pid.${environment.baseUrl}/kos/19050/baseURIPointsAt`,
    HasVersions: `https://pid.${environment.baseUrl}/kos/19050/hasVersions`,
    Distribution: `https://pid.${environment.baseUrl}/kos/19050/distribution`,
    HasBrokenDistributionEndpointLink: `https://pid.${environment.baseUrl}/kos/19050/hasEndpointURLStatus`,
    HasBrokenDataSteward: `https://pid.${environment.baseUrl}/kos/19050/hasBrokenDataSteward`,
    HasBrokenEndpointContact: `https://pid.${environment.baseUrl}/kos/19050/hasBrokenEndpointContact`,
    MaxCount: 'http://www.w3.org/ns/shacl#maxCount',
    Pattern: 'http://www.w3.org/ns/shacl#pattern',
    Range: 'http://www.w3.org/2000/01/rdf-schema#range',
    FieldType: `https://pid.${environment.baseUrl}/ns/shacl/fieldType`,
    RdfsLabel: 'http://www.w3.org/2000/01/rdf-schema#label',
    HasUriTemplate: `https://pid.${environment.baseUrl}/kos/19050/hasUriTemplate`,
    HasLaterVersion: `https://pid.${environment.baseUrl}/kos/19050/hasLaterVersion`,
    MetadataReleaseConfig: `https://pid.${environment.baseUrl}/kos/19050/646465`,
    ColidEntryDraft: `https://pid.${environment.baseUrl}/kos/19050/hasDraft`,
    Placeholder: `https://pid.${environment.baseUrl}/graph/example`,
    Link: {
      LifecycleStatus: {
        Deleted: `https://pid.${environment.baseUrl}/kos/19050/Deleted`,
        Created: `https://pid.${environment.baseUrl}/kos/19050/Created`
      }
    }
  },
  Identifier: {
    Type: `http://pid.${environment.baseUrl}/kos/19014/PermanentIdentifier`
  },
  Person: {
    Type: `http://pid.${environment.baseUrl}/kos/19014/Person`
  },
  DistributionEndpoint: {
    LifecycleStatus: {
      Active: `https://pid.${environment.baseUrl}/kos/19050/active`
    },
    DistributionKey: `https://pid.${environment.baseUrl}/kos/19050/distribution`
  },
  Assets: {
    Logo: `https://shared.${environment.baseUrl}/img/logo.svg`
  },
  Regex: {
    NaturalNumber: '^[0-9]*$',
    Guid: /(\{)?[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\})?/
  },
  Attachment: {
    Type: `https://pid.${environment.baseUrl}/kos/19050/Attachment`,
    FileSize: `https://pid.${environment.baseUrl}/kos/19050/hasFileSize`,
    FileType: `https://pid.${environment.baseUrl}/kos/19050/hasFileType`,
    Comment: 'http://www.w3.org/2000/01/rdf-schema#comment'
  },
  PidUriTemplate: {
    BaseUrl: environment.PidUriTemplate.BaseUrl,
    Prefix: `https://pid.${environment.baseUrl}/kos/19050#`,
    HasBaseUrl: `https://pid.${environment.baseUrl}/kos/19050#hasBaseUrl`,
    HasPidUriTemplateLifecycleStatus: `https://pid.${environment.baseUrl}/kos/19050/hasPidUriTemplateLifecycleStatus`,
    LifecycleStatus: {
      Active: `https://pid.${environment.baseUrl}/kos/19050/active`,
      Deprecated: `https://pid.${environment.baseUrl}/kos/19050/deprecated`
    }
  }
};

export const QuillEditorConfig = {
  Formats: [
    'background',
    'bold',
    'color',
    'font',
    'code',
    'italic',
    'link',
    'size',
    'strike',
    'script',
    'underline',
    'blockquote',
    'header',
    'indent',
    'list',
    'align',
    'direction',
    'code-block',
    'formula'
    // 'image'
    // 'video'
  ],

  Modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ align: [] }],
      ['clean'], // remove formatting button
      ['link'] // link
    ]
  }
};
