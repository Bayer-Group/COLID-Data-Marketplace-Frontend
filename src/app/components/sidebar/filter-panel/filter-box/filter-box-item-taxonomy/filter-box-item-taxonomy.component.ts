import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AggregationBucket } from 'src/app/shared/models/aggregation-bucket';
import { MetadataState } from 'src/app/states/metadata.state';
import { Observable, Subscription } from 'rxjs';
import { Select } from '@ngxs/store';
import { TaxonomyDTO } from 'src/app/shared/models/taxonomy-dto';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

@Component({
  selector: 'app-filter-box-item-taxonomy',
  templateUrl: './filter-box-item-taxonomy.component.html',
  styleUrls: ['./filter-box-item-taxonomy.component.scss']
})
export class FilterBoxItemTaxonomyComponent implements OnInit, OnDestroy {
  @Select(MetadataState.getMetadata) metadata$: Observable<any>;

  @Input() key: string;

  taxonomyTreeData: TaxonomyDTO[] = [];

  _buckets: any;
  aggregationBuckets: AggregationBucket[] = [];

  @Input() set buckets(values: AggregationBucket[]) {
    this.aggregationBuckets = values;
    this.normalizeAggregationBuckets()
  }

  @Output() changeFilterBuckets: EventEmitter<string[]> = new EventEmitter<string[]>();

  _activeAggregationBuckets: string[] = [];

  @Input() set activeAggregationBuckets(values: string[]) {
    if (values != null) {
      this._activeAggregationBuckets = values;
      setTimeout(() => {
        this.rewriteValues();
      }, 0)
    }
  };

  metadataSubscription: Subscription;

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TaxonomyDTO, TaxonomyDTO>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TaxonomyDTO, TaxonomyDTO>();

  treeControl: FlatTreeControl<TaxonomyDTO>;

  treeFlattener: MatTreeFlattener<TaxonomyDTO, TaxonomyDTO>;

  dataSource: MatTreeFlatDataSource<TaxonomyDTO, TaxonomyDTO>;

  /** The selection for checklist */
  checklistSelection: SelectionModel<TaxonomyDTO>;

  get isTaxonomy(): boolean { return this.taxonomyTreeData.some(t => t.hasChild); }

  constructor() { }

  ngOnInit() {
    this.metadataSubscription = this.metadata$.subscribe(m => {
      if (m != null && m[this.key] != null) {
        this.taxonomyTreeData = m[this.key].properties.taxonomy;
        this.initTree();
      }
    })
  }

  ngOnDestroy() {
    this.metadataSubscription.unsubscribe();
  }

  initTree() {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TaxonomyDTO>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.checklistSelection = new SelectionModel<TaxonomyDTO>(true /* multiple */);
    this.dataSource.data = this.taxonomyTreeData;
    this.rewriteValues();
  }

  normalizeAggregationBuckets() {
    const normalizedObject: any = {}
    for (let i = 0; i < this.aggregationBuckets.length; i++) {
      const key = this.aggregationBuckets[i].key
      normalizedObject[key] = this.aggregationBuckets[i].doc_count
    }
    this._buckets = normalizedObject;
  }

  getLevel = (node: TaxonomyDTO) => node.level;

  isExpandable = (node: TaxonomyDTO) => node.hasChild;

  getChildren = (node: TaxonomyDTO): TaxonomyDTO[] => node.children;

  hasChild = (_: number, _nodeData: TaxonomyDTO) => _nodeData.hasChild;

  /** Transformer to convert nested node to flat node. Record the nodes in maps for later use. */
  transformer(node: TaxonomyDTO, level: number) {
    node.level = level;
    return node;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TaxonomyDTO): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TaxonomyDTO): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the item selection. Select/deselect all the descendants node */
  itemSelectionToggle(node: TaxonomyDTO, initial: boolean = false): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
    this.emitLastChange(initial);
  }

  /** Toggle a leaf item selection. Check all the parents to see if they changed */
  leafItemSelectionToggle(node: TaxonomyDTO, initial: boolean = false): void {
    this.checklistSelection.toggle(node);

    this.checkAllParentsSelection(node);
    this.emitLastChange(initial);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TaxonomyDTO): void {
    let parent: TaxonomyDTO | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TaxonomyDTO): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TaxonomyDTO): TaxonomyDTO | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  rewriteValues() {
    this.dataSource.data = this.filterIndexedTaxonomyItems(this.taxonomyTreeData, this.aggregationBuckets)

    this.handleNodeList(this._activeAggregationBuckets, this.taxonomyTreeData);

    this.treeControl.dataNodes.forEach(s => {
      if (this.descendantsPartiallySelected(s) || this.checklistSelection.isSelected(s)){
        this.treeControl.expand(s);
      }
    })
  }

  filterIndexedTaxonomyItems(treeData: TaxonomyDTO[], aggregationBuckets: AggregationBucket[]): TaxonomyDTO[] {
    const indexedItems = treeData.filter(t => aggregationBuckets.some(a => a.key === t.name));
    indexedItems.forEach(i => {
      if (i.hasChild){
        i.children = this.filterIndexedTaxonomyItems(i.children, aggregationBuckets);
      }
    });
    return indexedItems;
  }

  handleNodeList(identifiers: string[], results: TaxonomyDTO[]) {
    if (identifiers == null || this.checklistSelection == null) return;

    if (this.treeControl == null || this.treeControl.dataNodes == null) return;

    results.forEach(t => {
      if (identifiers.includes(t.name)) {
        if (!this.checklistSelection.isSelected(t)) {
          if (t.hasChild) {
            this.itemSelectionToggle(t, true);
          } else {
            this.leafItemSelectionToggle(t, true);
          }
        }
      } else {
        this.handleNodeList(identifiers, t.children);
      }
    });
  }

  emitLastChange(initial: boolean = false) {
    if (initial) return;

    const activeBuckets = this.filterDuplicatesAndRemoveChildNodes();
    if (this._activeAggregationBuckets != null && activeBuckets.length === this._activeAggregationBuckets.length && activeBuckets.every(t => this._activeAggregationBuckets.includes(t))) {
      return;
    }
    this.changeFilterBuckets.emit(activeBuckets);
  }

  filterDuplicatesAndRemoveChildNodes(): string[] {
    var resultList: TaxonomyDTO[] = Object.assign(this.checklistSelection.selected);
    this.checklistSelection.selected.forEach(e => {
      if (e.children.every(n => this.checklistSelection.selected.some(r => r.id === n.id))) {
        resultList = resultList.filter(re => !e.children.some(n => n.id === re.id));
      }
    });
    return resultList.map(s => s.name);
  }
}
