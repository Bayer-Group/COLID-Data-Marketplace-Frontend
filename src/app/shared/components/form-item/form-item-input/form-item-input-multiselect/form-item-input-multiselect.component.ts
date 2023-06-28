import { Component, OnInit, Input, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { FormItemInputBaseComponent } from "../form-item-input-base/form-item-input-base.component";
import { MetaDataProperty } from "src/app/shared/models/metadata/meta-data-property";
import { BaseEntityResultDTO } from "src/app/shared/models/entities/base-entity-result-dto";
import { Constants } from "src/app/shared/constants";
import { Observable, Subject } from "rxjs";
import { BaseEntityRequestDTO } from "src/app/shared/models/entities/base-entity-request-dto";
import { MultiselectSettings } from "src/app/shared/models/form/multi-select-settings";
import { Store, Select } from "@ngxs/store";
import {
  FetchTaxonomyList,
  TaxonomyState,
} from "src/app/states/taxonomy.state";
import { TaxonomyResultDTO } from "src/app/shared/models/taxonomy/taxonomy-result-dto";

@Component({
  selector: "app-form-item-input-multiselect",
  templateUrl: "./form-item-input-multiselect.component.html",
  styleUrls: ["./form-item-input-multiselect.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormItemInputMultiselectComponent),
      multi: true,
    },
  ],
})
export class FormItemInputMultiselectComponent
  extends FormItemInputBaseComponent
  implements OnInit
{
  @Select(TaxonomyState.getTaxonomyList) taxonomyList$: Observable<
    Map<string, TaxonomyResultDTO[]>
  >;

  @Input() maxCount: number;
  @Input() multiselectSettings: MultiselectSettings;

  @Input() set metadata(metadata: MetaDataProperty) {
    this.range = metadata.properties[Constants.Metadata.Range];
  }

  range: string;

  entityList: TaxonomyResultDTO[] = [];

  loading = false;

  multiInput$ = new Subject<string>();

  public addTagNowRef: (name) => void;

  constructor(private store: Store) {
    super();
    this.addTagNowRef = this.addTagPromise.bind(this);
  }

  ngOnInit() {
    this.store.dispatch(new FetchTaxonomyList(this.range)).subscribe();
    this.taxonomyList$.subscribe((res) => {
      this.entityList = res.get(this.range);
    });
  }

  writeValue(value: any): void {
    if (value != null) {
      const valueList = Array.isArray(value) ? value : [value];
      this.internalValue = this.multiselectSettings.multiple
        ? valueList
        : valueList[0];
    }
  }

  addTagPromise(name) {
    return new Promise((resolve) => {
      if (this.multiselectSettings.addTag) {
        this.loading = true;
        resolve(name);
        this.loading = false;
        this.multiInput$.next(null);
      }
    });
  }

  createEntity(name: string, range: string): BaseEntityRequestDTO {
    const entity = new BaseEntityRequestDTO();
    entity.properties[Constants.Metadata.EntityType] = [range];
    entity.properties[Constants.Metadata.RdfsLabel] = [name.trim()];
    return entity;
  }

  trackByFn(item: BaseEntityResultDTO) {
    return item.id;
  }
}
