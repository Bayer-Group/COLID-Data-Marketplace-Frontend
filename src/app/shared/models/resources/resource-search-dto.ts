export class ResourceSearchDTO {
  searchText: string;
  draft: boolean;
  published: boolean;
  markedForDeletion: boolean;
  consumerGroup: string;
  lastChangeUser: string;
  type: string;
  author: string;
  orderPredicate: string;
  sequence: 'asc' | 'desc';
  limit: number;
  offset: number;
  pidUris: string[];
  public constructor() {
    this.pidUris = new Array<string>();
  }
}
