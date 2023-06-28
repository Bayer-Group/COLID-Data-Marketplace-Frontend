export interface FilterGroupingOrderRaw {
  groupName: string;
  groupOrder: number;
  expanded: boolean;
  filters: {
    propertyOrder: number;
    propertyUri: string;
    expanded?: boolean;
  }[];
}
