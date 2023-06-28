export class FormChangedDTO {
  // Key of changed form item
  id: string;

  // New value of changed form item
  value: any;

  formValue: string;

  // If main entity changed
  main: boolean;

  initialBuild: boolean;

  created: boolean;

  constructor(
    id: string,
    value: any,
    formValue: any,
    main: boolean,
    initialBuild: boolean = false,
    created = false
  ) {
    this.id = id;
    this.value = value;
    this.formValue = formValue;
    this.initialBuild = initialBuild;
    this.main = main;
    this.created = created;
  }
}
