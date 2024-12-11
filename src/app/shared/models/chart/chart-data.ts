export class ChartData {
  xLabel: string;
  yLabel: string;
  name: string;
  description: string;
  data: any;
  initalChart:
    | 'pie'
    | 'line-chart'
    | 'bar-vertical'
    | 'bar-horizontal-normalized';
}
