import { Component, OnInit } from "@angular/core";
import {
  ExtendedUriTemplateState,
  FetchExtendedUriTemplateMetadata,
} from "src/app/states/extended-uri-template.state";
import { Store, Select } from "@ngxs/store";
import { MetaDataProperty } from "src/app/shared/models/metadata/meta-data-property";
import { Observable } from "rxjs";

@Component({
  selector: "app-extended-uri-template",
  templateUrl: "./extended-uri-template.component.html",
  styleUrls: ["./extended-uri-template.component.css"],
})
export class ExtendedUriTemplateComponent implements OnInit {
  @Select(ExtendedUriTemplateState.getExtendedUriTemplateMetadata)
  extendedUriTemplateMetadata$: Observable<Array<MetaDataProperty>>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new FetchExtendedUriTemplateMetadata()).subscribe();
  }
}
