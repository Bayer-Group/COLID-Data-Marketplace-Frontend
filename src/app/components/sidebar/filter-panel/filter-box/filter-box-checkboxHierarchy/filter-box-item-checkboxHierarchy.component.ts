import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AggregationBucket } from 'src/app/shared/models/aggregation-bucket';
import { MetadataState } from 'src/app/states/metadata.state';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { CheckboxHierarchyDTO } from 'src/app/shared/models/checkboxHierarchy-dto';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

@Component({
  selector: 'app-filter-box-item-checkboxHierarchy',
  templateUrl: './filter-box-item-checkboxHierarchy.component.html',
  styleUrls: ['./filter-box-item-checkboxHierarchy.component.scss']
})
export class FilterBoxItemCheckboxHierarchyComponent implements OnInit {
  @Select(MetadataState.getMetadata) metadata$: Observable<any>;
  @Select(MetadataState.getResourceTypeHierarchy) resourceHierarchy$: Observable<CheckboxHierarchyDTO[]>;

  resourceHierarchy: CheckboxHierarchyDTO[];

  @Input() key: string;

  checkboxHierarchyTreeData: CheckboxHierarchyDTO[] = [];
  treeDataNodeList: CheckboxHierarchyDTO[] = []; //linear list of all nodes

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
  flatNodeMap = new Map<CheckboxHierarchyDTO, CheckboxHierarchyDTO>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<CheckboxHierarchyDTO, CheckboxHierarchyDTO>();

  treeControl: FlatTreeControl<CheckboxHierarchyDTO>;

  treeFlattener: MatTreeFlattener<CheckboxHierarchyDTO, CheckboxHierarchyDTO>;

  dataSource: MatTreeFlatDataSource<CheckboxHierarchyDTO, CheckboxHierarchyDTO>;

  nameIdMap = new Map<string, string[]>();

  /** The selection for checklist */
  checklistSelection: SelectionModel<CheckboxHierarchyDTO>;

  get isCheckboxHierarchy(): boolean { return this.checkboxHierarchyTreeData.some(t => t.hasChild); }

  constructor(private store: Store) { }

  ngOnInit() {
    this.resourceHierarchy$.subscribe(r => {
      var exist = this.checkboxHierarchyTreeData
      if (r) {
        this.checkboxHierarchyTreeData = r
        this.initTree();
      }
    });


  }



  initTree() {

    this.AddAllNonInstantiableNodes(this.checkboxHierarchyTreeData)
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<CheckboxHierarchyDTO>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.checklistSelection = new SelectionModel<CheckboxHierarchyDTO>(true /* multiple */);
    this.dataSource.data = this.checkboxHierarchyTreeData;
    this.rewriteValues();

  }

  AddAllNonInstantiableNodes(nodeList: CheckboxHierarchyDTO[]) {
    nodeList.forEach(node => {
      if (!node.instantiable) {
        var element = {
          "key": node.name,
          "doc_count": 0
        }
        this.aggregationBuckets.push(element)



        this.AddAllNonInstantiableNodes(node.children)
      } else {
        var idList = this.nameIdMap.get(node.name)
        if (!idList) {
          idList = []
        }
        idList.push(node.id)
        this.nameIdMap.set(node.name, idList)
      }

      this.treeDataNodeList.push(node)
    });
  }

  normalizeAggregationBuckets() {
    const normalizedObject: any = {}
    for (let i = 0; i < this.aggregationBuckets.length; i++) {
      const key = this.aggregationBuckets[i].key
      normalizedObject[key] = this.aggregationBuckets[i].doc_count
    }
    this._buckets = normalizedObject;
  }

  getLevel = (node: CheckboxHierarchyDTO) => node.level;

  isExpandable = (node: CheckboxHierarchyDTO) => true//node.hasChild;

  getChildren = (node: CheckboxHierarchyDTO): CheckboxHierarchyDTO[] => node.children;

  hasChild = (_: number, _nodeData: CheckboxHierarchyDTO) => _nodeData.hasChild;

  /** Transformer to convert nested node to flat node. Record the nodes in maps for later use. */
  transformer(node: CheckboxHierarchyDTO, level: number) {
    node.level = level;
    return node;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: CheckboxHierarchyDTO): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: CheckboxHierarchyDTO): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    var jo = result && !this.descendantsAllSelected(node);
    return jo
  }

  /** Toggle the item selection. Select/deselect all the descendants node */
  itemSelectionToggle(node: CheckboxHierarchyDTO, initial: boolean = false): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);

    if (this.checklistSelection.isSelected(node)) {
      this.checklistSelection.select(...descendants)
      descendants.forEach(y => {
        this.treeDataNodeList.forEach(x => {
          if (x.name == y.name && x.id != y.id) {
            this.checklistSelection.select(x)
          }
        })

      })
    } else {
      this.checklistSelection.deselect(...descendants);
      descendants.forEach(y => {
        this.treeDataNodeList.forEach(x => {
          if (x.name == y.name && x.id != y.id) {
            this.checklistSelection.deselect(x)
          }
        })

      })
    }

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
    this.emitLastChange(initial);
  }

  /** Toggle a leaf item selection. Check all the parents to see if they changed */
  leafItemSelectionToggle(node: CheckboxHierarchyDTO, initial: boolean = false): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    this.treeDataNodeList.forEach(x => {
      if (x.name == node.name && x.id != node.id) {
        this.checklistSelection.toggle(x);
        this.checkAllParentsSelection(x);
      }
    })


    this.emitLastChange(initial);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: CheckboxHierarchyDTO): void {
    let parent: CheckboxHierarchyDTO | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: CheckboxHierarchyDTO): void {
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
  getParentNode(node: CheckboxHierarchyDTO): CheckboxHierarchyDTO | null {
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


    if (this.dataSource) {

      this.dataSource.data = this.filterIndexedCheckboxHierarchyItems(this.checkboxHierarchyTreeData, this.aggregationBuckets)

      this.handleNodeList(this._activeAggregationBuckets, this.checkboxHierarchyTreeData);

      this.treeControl.dataNodes.forEach(s => {
        //if (this.descendantsPartiallySelected(s) || this.checklistSelection.isSelected(s)){
        this.treeControl.expand(s);
        //}
      })
    }
  }

  filterIndexedCheckboxHierarchyItems(treeData: CheckboxHierarchyDTO[], aggregationBuckets: AggregationBucket[]): CheckboxHierarchyDTO[] {
    if (treeData) {

      const indexedItems = treeData.filter(t => aggregationBuckets.some(a => a.key === t.name));
      indexedItems.forEach(i => {
        if (i.hasChild) {
          i.children = this.filterIndexedCheckboxHierarchyItems(i.children, aggregationBuckets);
        }
      });
      return indexedItems;
    }
  }

  handleNodeList(identifiers: string[], results: CheckboxHierarchyDTO[]) {

    var idList = [];
    identifiers.forEach(x => idList = [...idList, ...this.nameIdMap.get(x)])

    if (identifiers == null || this.checklistSelection == null) return;

    if (this.treeControl == null || this.treeControl.dataNodes == null) return;



    results.forEach(t => {
      if (t.instantiable &&
        idList.includes(t.id)
      ) {
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
    var result: string[] = []
    this.checklistSelection.selected.forEach(e => {
      if (e.instantiable && !result.includes(e.id)) {
        result.push(e.id)
      }
    });


    return result
  }
}
