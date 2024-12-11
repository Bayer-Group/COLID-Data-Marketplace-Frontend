import { Resource } from '../models/resources/resource';
import { Constants } from 'src/app/shared/constants';
import { HistoricResourceOverviewDTO } from '../models/resources/historic-resource-overview-dto';

export class ResourceExtension {
  public static hasPublishedVersion(resource: Resource) {
    if (resource.publishedVersion != null) {
      return true;
    }

    const lifeCycleStatusProperty =
      resource.properties[Constants.Metadata.LifeCycleStatus];
    // The entry is published if there is a lifecycle status and it is published or marked for deletion.
    return (
      lifeCycleStatusProperty != null &&
      (lifeCycleStatusProperty[0] ===
        Constants.Resource.LifeCycleStatus.Published ||
        lifeCycleStatusProperty[0] ===
          Constants.Resource.LifeCycleStatus.MarkedDeletion)
    );
  }

  public static hasDraftVersion(resource: Resource) {
    const lifeCycleStatusProperty =
      resource.properties[Constants.Metadata.LifeCycleStatus];
    if (
      lifeCycleStatusProperty != null &&
      lifeCycleStatusProperty[0] === Constants.Resource.LifeCycleStatus.Draft
    ) {
      return true;
    }

    const colidEntryDraftProperty =
      resource.properties[Constants.Metadata.ColidEntryDraft];
    return (
      colidEntryDraftProperty != null && colidEntryDraftProperty[0] != null
    );
  }

  public static isMarkedDeleted(resource: Resource) {
    const lifeCycleStatusProperty =
      resource.properties[Constants.Metadata.LifeCycleStatus];
    return (
      lifeCycleStatusProperty != null &&
      lifeCycleStatusProperty[0] ===
        Constants.Resource.LifeCycleStatus.MarkedDeletion
    );
  }

  public static isAuthorizedToDeleteDraft(resource: Resource): boolean {
    // If the draft version exists, it is shown primpary to the user instead of the published version
    // The user is only allowed to delete the draft version, not the published version, of the resource
    // The user is allowed to mark the draft version as deleted, so that the admin checks and executes this.
    // Only administrators are allowed to delete a published resource
    return this.hasDraftVersion(resource);
  }

  public static isAuthorizedToMarkForDeletion(resource: Resource): boolean {
    return (
      this.hasPublishedVersion(resource) && !this.hasDraftVersion(resource)
    );
  }

  public static isAllowedToUnlink(resource: Resource): boolean {
    if (resource.laterVersion || resource.previousVersion) {
      // An entry may not be unlinked if there is a base uri and this baseuri is equal to the previous or later base uri.
      return !(
        resource.baseUri != null &&
        ((resource.previousVersion != null &&
          resource.baseUri === resource.previousVersion.baseUri) ||
          (resource.laterVersion != null &&
            resource.baseUri === resource.laterVersion.baseUri))
      );
    }

    return false;
  }

  public static createHistoricOverviewByResource(
    resource: Resource
  ): HistoricResourceOverviewDTO {
    return {
      id: resource.id,
      pidUri: resource.pidUri,
      lastChangeDateTime:
        resource.properties[Constants.Metadata.LastChangeDateTime][0],
      lastChangeUser:
        resource.properties[Constants.Metadata.HasLastChangeUser][0],
      lifeCycleStatus:
        resource.properties[Constants.Metadata.LifeCycleStatus][0]
    };
  }
}
