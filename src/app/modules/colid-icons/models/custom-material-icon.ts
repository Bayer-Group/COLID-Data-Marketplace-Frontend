export class CustomMaterialIcon {
  key: string;
  url: string;
  tooltip: string = "";

  constructor(key: string, url: string, tooltip: string = "") {
    this.key = key;
    this.url = url;
    this.tooltip = tooltip;
  }
}
