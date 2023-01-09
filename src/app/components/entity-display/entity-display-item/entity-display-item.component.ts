import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Constants } from 'src/app/shared/constants';
import { StringExtension } from 'src/app/shared/extensions/string.extension';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { MetaDataPropertyIdentifier, FieldTypeMapping } from 'src/app/shared/models/resources/resource-form.constants';

@Component({
  selector: "app-entity-display-item",
  templateUrl: "./entity-display-item.component.html",
  styleUrls: ["./entity-display-item.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityDisplayItemComponent implements OnInit {
  @Input() metadataProperty: MetaDataProperty;
  @Input() entityProperty: Array<any>;
  @Input() entityVersions: Array<any>;
  @Input() mainDistributionEndpoint: boolean;

  replaceSpecialCharacterFromText =
    StringExtension.ReplaceSpecialCharacterFromText;

  constructor() {}

  ngOnInit(): void {}

  get displayType(): string {
    const group = this.metadataProperty.properties[Constants.Metadata.Group];
    if (
      this.metadataProperty.key === Constants.Metadata.HasPidUri ||
      this.metadataProperty.key === MetaDataPropertyIdentifier.baseUri
    ) {
      return "identifier";
    }

    if (this.metadataProperty.key === Constants.Metadata.HasVersion) {
      return "version";
    }

    if (this.isDistribution) {
      return "distribution";
    }

    if (
      this.metadataProperty.properties[Constants.Metadata.RDFS.Range] &&
      this.metadataProperty.properties[Constants.Metadata.NodeKind] ===
        Constants.Metadata.NodeType.IRI &&
      !(group != null && group.key === Constants.Resource.Groups.LinkTypes)
    ) {
      return "taxonomy";
    }

    if (this.checkEmail) {
      return "email";
    }

    if (
      FieldTypeMapping[
        this.metadataProperty.properties[Constants.Metadata.Datatype]
      ] === "html"
    ) {
      return "html";
    }

    if (
      FieldTypeMapping[
        this.metadataProperty.properties[Constants.Metadata.Datatype]
      ] === "datetime"
    ) {
      return "datetime";
    }

    if (
      this.checkUrl &&
      this.metadataProperty.key === Constants.Metadata.HasTargetUri
    ) {
      return this.checkProtocol ? "url" : "externalUrl";
    }

    return "default";
  }

  get isDistribution(): boolean {
    return this.metadataProperty.nestedMetadata.length !== 0;
  }

  get checkEmail() {
    return (
      this.entityProperty &&
      this.entityProperty.some((value) => re_email.test(value))
    );
  }

  get checkUrl() {
    return (
      this.entityProperty &&
      this.entityProperty.some((value) => re_weburl.test(value))
    );
  }

  get checkProtocol() {
    return (
      this.entityProperty &&
      this.entityProperty.some((value) => re_protocol.test(value))
    );
  }

  nestedMetdata(endpoint): Array<MetaDataProperty> {
    if (endpoint != null && endpoint.properties) {
      const endpointType =
        endpoint.properties[Constants.Metadata.EntityType][0];
      const nestedMetdata = this.metadataProperty.nestedMetadata.filter(
        (m) => m.key === endpointType
      )[0];
      return nestedMetdata.properties;
    }
    return [];
  }

  getEndpointLabel(entity): string {
    const entityLabel =
      entity.properties[Constants.Metadata.HasNetworkedResourceLabel];
    return StringExtension.ReplaceHtmlToText(entityLabel[0]);
  }

  get entityTypeURI() {
    return Constants.Metadata.EntityType;
  }

  get owlRange() {
    return Constants.OWL.Class;
  }
}

export const re_email = new RegExp(
  /^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/
);

export const re_protocol = new RegExp(
  "^" +
    // protocol identifier
    "(?:(?:https?|http?|ftp)://)"
);

export const re_weburl = new RegExp(
  "^" +
    // protocol identifier
    "(?:(?:https?|http?|ftp)://)*" +
    // user:pass authentication
    "(?:\\S+(?::\\S*)?@)?" +
    "(?:" +
    // IP address exclusion
    // private & local networks
    "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
    "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
    "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
    // IP address dotted notation octets
    // excludes loopback network 0.0.0.0
    // excludes reserved space >= 224.0.0.0
    // excludes network & broacast addresses
    // (first & last IP address of each class)
    "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
    "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
    "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
    "|" +
    // host name
    "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
    // domain name
    "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
    // TLD identifier
    "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
    // TLD may end with dot
    "\\.?" +
    ")" +
    // port number
    "(?::\\d{2,5})?" +
    // resource path
    "(?:[/?#]\\S*)?" +
    "$",
  "i"
);
