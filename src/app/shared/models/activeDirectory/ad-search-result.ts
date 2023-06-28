import { AdUser } from "./ad-user";
import { AdGroup } from "./ad-group";

export class AdSearchResult {
  users: Array<AdUser>;
  groups: Array<AdGroup>;

  constructor() {
    this.users = [];
    this.groups = [];
  }
}
