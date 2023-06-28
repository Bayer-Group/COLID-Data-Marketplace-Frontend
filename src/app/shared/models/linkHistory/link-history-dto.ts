export interface LinkHistoryDto {
  linkHistoryId: string;
  linkStatus: string;
  inBound: boolean;
  linkType: string;
  linkTypeLabel: string;
  dateCreated: string;
  dateDeleted: string;
  author: string;
  deletedBy: string;
  linkStartResourcetId: string;
  linkStartResourcePidUri: string;
  linkStartResourceLabel: string;
  linkStartResourceType: string;
  linkStartResourceTypeLabel: string;
  linkEndResourcetId: string;
  linkEndResourcePidUri: string;
  linkEndResourceLabel: string;
  linkEndResourceType: string;
  linkEndResourceTypeLabel: string;
}
