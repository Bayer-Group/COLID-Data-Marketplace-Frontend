export class FormItemChangedDTO {
  id: string;
  value: any;
  created: boolean;

  constructor(id: string, value: any, created = false) {
    this.id = id;
    this.value = value;
    this.created = created;
  }
}
