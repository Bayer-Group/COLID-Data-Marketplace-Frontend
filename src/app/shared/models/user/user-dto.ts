import { ColidEntrySubscriptionDto } from "./colid-entry-subscription-dto";
import { SearchFilterDataMarketplaceDto } from "./search-filter-data-marketplace-dto";
import { MessageConfigDto } from "./message-config-dto";
import { DefaultConsumerGroupDto } from "./default-consumer-group-dto";
import { SearchFilterEditor } from "./search-filter-editor";

export class UserDto {
  id: string;
  emailAddress: string;
  lastLoginDataMarketplace: Date;
  defaultConsumerGroup: DefaultConsumerGroupDto;
  searchFilterEditor: SearchFilterEditor;
  colidEntrySubscriptions: ColidEntrySubscriptionDto[];
  messageConfig: MessageConfigDto;
  defaultSearchFilterDataMarketplace: number;
  searchFiltersDataMarketplace: SearchFilterDataMarketplaceDto[];
  department: string;

  public constructor(id: string, emailAddress: string) {
    this.id = id;
    this.emailAddress = emailAddress;
  }
}
