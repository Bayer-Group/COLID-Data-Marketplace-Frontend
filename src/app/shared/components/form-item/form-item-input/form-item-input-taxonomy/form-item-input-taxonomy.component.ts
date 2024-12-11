import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  TaxonomyState,
  FetchTaxonomyList
} from 'src/app/states/taxonomy.state';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { TaxonomyResultDTO } from 'src/app/shared/models/taxonomy/taxonomy-result-dto';
import { FormItemInputBaseComponent } from '../form-item-input-base/form-item-input-base.component';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { Constants } from 'src/app/shared/constants';
import { TreeViewSelectionChangeEvent } from 'src/app/shared/models/tree-view-selection-change-event';

// TODO: Unify - duplicate code with colid-ui-editor-frontend

@Component({
  selector: 'app-form-item-input-taxonomy',
  templateUrl: './form-item-input-taxonomy.component.html',
  styleUrls: ['./form-item-input-taxonomy.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormItemInputTaxonomyComponent),
      multi: true
    }
  ]
})
export class FormItemInputTaxonomyComponent
  extends FormItemInputBaseComponent
  implements OnInit
{
  @Select(TaxonomyState.getTaxonomyList) taxonomyList$: Observable<
    Map<string, TaxonomyResultDTO[]>
  >;

  getTaxonomyList: TaxonomyResultDTO[];
  getTaxonomyByType: TaxonomyResultDTO;

  taxonomyMenuOpened: boolean = false;

  @Input() metadata: MetaDataProperty;
  singleSelection: boolean = false;

  _internalValue: TaxonomyResultDTO[] = [];

  get taxonomyType(): string {
    return this.metadata?.properties[Constants.Metadata.Range];
  }

  constructor(private store: Store) {
    super();
  }

  ngOnInit() {
    this.store.dispatch(new FetchTaxonomyList(this.taxonomyType));
    this.taxonomyList$.subscribe((res) => {
      this.getTaxonomyList = res.get(this.taxonomyType);
    });
  }

  handleSelectionChanged(event: TreeViewSelectionChangeEvent) {
    this._internalValue = this.filterDuplicatesAndRemoveChildNodes(
      event.values
    );
    let nodesAsString = this._internalValue.map((x) => x.id);

    /*
      If it is an initial change, the value is written from the upper component and
      already stored as value in the form.
      Therefore, the changes do not need to be passed further up.
      */
    if (!event.initialChange) {
      this.internalValue = nodesAsString;
      this.handleValueChanged(nodesAsString);
    }
  }

  // Filter our all double entries and return only the id of parents and selected ones
  filterDuplicatesAndRemoveChildNodes(
    event: TaxonomyResultDTO[]
  ): TaxonomyResultDTO[] {
    let resultList: TaxonomyResultDTO[] = [
      ...new Map(event.map((item) => [item.id, item])).values()
    ];

    resultList.forEach((r) => {
      if (r.hasChild) {
        r.children = this.filterDuplicatesAndRemoveChildNodes(r.children);
      }
    });

    return resultList;
  }

  removeTaxonomy(taxonomy: TaxonomyResultDTO) {
    //remove the X'ed ID.
    var selectedValues: TaxonomyResultDTO[] = this._internalValue.filter(
      (t) => t.id !== taxonomy.id
    );
    //remove all the children if any.
    taxonomy.children
      .map((t) => t.id)
      .forEach((idToDelete) => {
        const index = selectedValues.findIndex(({ id }) => id === idToDelete);
        selectedValues.splice(index, 1);
      });
    //remove all the parents and grandparents from selection if any.
    if (taxonomy.hasParent) {
      /* Bug Fix 
        this recursive function returns true for parents & grandparents of the X'd taxonomyID
        and thus those parent entities could be removed from selection because
        entire parent shouldn't be shown as selected if "at the least" a single child is removed (X'd) */
      selectedValues.forEach((item) => {
        this.removeParentsAndGrandparents(item, taxonomy.id)
          ? (selectedValues = selectedValues.filter((t) => t.id !== item.id))
          : selectedValues;
      });
    }
    this.handleSelectionChanged({
      initialChange: false,
      values: selectedValues
    });
  }

  removeParentsAndGrandparents(
    taxonomyList: TaxonomyResultDTO,
    taxonomyID: string
  ) {
    try {
      if (taxonomyList.children.some((x) => x.id == taxonomyID)) {
        return true;
      } else if (taxonomyList.children.length > 0) {
        for (var i = 0; i < taxonomyList.children.length; i++) {
          return this.removeParentsAndGrandparents(
            taxonomyList.children[i],
            taxonomyID
          );
        }
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  }
  handleMenuOpened() {
    this.taxonomyMenuOpened = true;
  }

  handleMenuClosed() {
    this.taxonomyMenuOpened = false;
  }

  removeItems() {
    this.handleSelectionChanged({ initialChange: false, values: [] });
  }
}
