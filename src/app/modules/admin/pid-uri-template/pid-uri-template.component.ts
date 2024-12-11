import { Component, OnInit } from '@angular/core';
import {
  PidUriTemplateState,
  FetchPidUriTemplates,
  FetchPidUriTemplateMetadata
} from 'src/app/states/pid-uri-template.state';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { PidUriTemplateResultDTO } from 'src/app/shared/models/pidUriTemplates/pid-uri-template-result-dto';

@Component({
  selector: 'app-pid-uri-template',
  templateUrl: './pid-uri-template.component.html',
  styleUrls: ['./pid-uri-template.component.css']
})
export class PidUriTemplateComponent implements OnInit {
  @Select(PidUriTemplateState.getPidUriTemplateMetadata)
  pidUriTemplateMetadata$: Observable<Array<MetaDataProperty>>;

  @Select(PidUriTemplateState.getPidUriTemplates) pidUriTemplates$: Observable<
    Array<PidUriTemplateResultDTO>
  >;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new FetchPidUriTemplateMetadata());
    this.store.dispatch(new FetchPidUriTemplates());
  }

  reload() {
    this.store.dispatch(new FetchPidUriTemplates());
  }
}
