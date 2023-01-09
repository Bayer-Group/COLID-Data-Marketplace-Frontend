import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { Store } from "@ngxs/store";
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { FetchTaxonomyList, TaxonomyState } from 'src/app/states/taxonomy.state';
import { TaxonomyDTO } from 'src/app/shared/models/taxonomy-dto';
import { Constants } from 'src/app/shared/constants';
import { concatMap } from 'rxjs/operators';

@Component({
  selector: "app-entity-display-item-taxonomy",
  templateUrl: "./entity-display-item-taxonomy.component.html",
  styleUrls: ["./entity-display-item-taxonomy.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityDisplayItemTaxonomyComponent implements OnInit {
  @Input() values: string[] = [];
  @Input() metadataProperty: MetaDataProperty;

  @Input() key: string;
  @Input() range: string;

  taxonomyList$: Observable<TaxonomyDTO[]>;

  badgeTaxonomies = [
    Constants.Metadata.Keywords,
    Constants.ConsumerGroup.HasPidUriTemplate,
    Constants.Metadata.ContainsTherapeuticAreas,
    Constants.Metadata.ContainsRwdDimensions,
  ];

  get isBadgeTaxonomy(): boolean {
    const key = this.metadataProperty == null ? this.key : this.metadataProperty.key;
    return this.badgeTaxonomies.includes(key);
  }

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.taxonomyList$ = this.store.dispatch(new FetchTaxonomyList(
          this.range ?? this.metadataProperty.properties[Constants.Metadata.RDFS.Range]))
      .pipe(
        concatMap((_) => {
          let taxonomyList = this.store.selectSnapshot(TaxonomyState.getTaxonomyList);
          let taxonomy = taxonomyList.get(this.range ??this.metadataProperty.properties[Constants.Metadata.RDFS.Range]);
          let filteredTaxonomy = taxonomy.filter((t) =>
            this.values.includes(t.id)
          );
          return of(filteredTaxonomy);
        })
      );
  }
}
