import { Component, OnInit } from '@angular/core';
import {
  ExtendedUriTemplateState,
  FetchExtendedUriTemplates,
  ClearExtendedUriTemplate
} from 'src/app/states/extended-uri-template.state';
import { Select, Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ExtendedUriTemplateResultDTO } from 'src/app/shared/models/extendedUriTemplates/extended-uri-template-result-dto';

@Component({
  selector: 'app-extended-uri-template-display',
  templateUrl: './extended-uri-template-display.component.html',
  styleUrls: ['./extended-uri-template-display.component.css']
})
export class ExtendedUriTemplateDisplayComponent implements OnInit {
  @Select(ExtendedUriTemplateState.getExtendedUriTemplates)
  extendedUriTemplates$: Observable<Array<ExtendedUriTemplateResultDTO>>;

  constructor(
    private router: Router,
    private store: Store
  ) {}

  ngOnInit() {
    this.loadExtendedUriTemplates();
    this.store.dispatch(new ClearExtendedUriTemplate()).subscribe();
  }

  loadExtendedUriTemplates() {
    this.store.dispatch(new FetchExtendedUriTemplates()).subscribe();
  }

  createExtendedUriTemplate() {
    this.router.navigate(['admin/extendedUriTemplates/create']);
  }
}
