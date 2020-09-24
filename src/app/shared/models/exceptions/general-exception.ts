export class GeneralException {
  readonly type: string = this.constructor.name;
  code: number;
  requestId: string;
  message: string;
}
