export class MetaDataPropertyGroup {
  key: string;
  label: string;
  order: number;
  editDescription: string;
  viewDescription: string;

  constructor(
    key: string,
    label: string,
    order: number,
    editDescription: string,
    viewDescription: string
  ) {
    this.key = key;
    this.label = label;
    this.order = order;
    this.editDescription = editDescription;
    this.viewDescription = viewDescription;
  }
}
