import { PropertyStatisticItem } from './property-statistic-item';

export interface PropertyStatistics {
  name: string;
  increment: number;
  counts: PropertyStatisticItem[];
}
