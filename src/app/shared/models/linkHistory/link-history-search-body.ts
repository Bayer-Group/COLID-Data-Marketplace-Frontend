export interface LinkHistorySearchBody {
  startDate: Date;
  endDate: Date;
  email?: string;
  linkType?: string;
  from: number;
  size: number;
  orderByColumn?: string;
  orderDescending: boolean;
}
