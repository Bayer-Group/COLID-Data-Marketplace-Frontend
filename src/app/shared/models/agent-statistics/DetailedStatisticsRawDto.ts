export interface DetailedStatisticsRawDto {
  crawlerDurationAverage: { duration: number; date: string }[];
  crawlerDurationSum: { duration: number; date: string }[];
  itemsCrawled: { itemsCrawled: number; date: string }[];
  itemsToUpdate: { itemsToUpdate: number; date: string }[];
  itemsUpdated: { itemsUpdated: number; date: string }[];
}
