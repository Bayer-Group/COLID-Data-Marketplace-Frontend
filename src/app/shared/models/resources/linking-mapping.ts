export class LinkingMapping {
  pidUri: string;
  InboundLinkLabel: string;
  InboundLinkComment: string;
  linkType: LinkType;

  constructor(pidUri: string, linkType: LinkType) {
    (this.pidUri = pidUri), (this.linkType = linkType);
  }
}

export enum LinkType {
  Inbound,
  Outbound,
}
