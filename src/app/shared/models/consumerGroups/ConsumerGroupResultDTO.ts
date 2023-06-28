export class ConsumerGroupResultDTO {
  id: string;
  name: string;
  lifecycleStatus: string;
  properties: { [id: string]: any[] };
}
