import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AggregationBucket } from 'src/app/shared/models/aggregation-bucket';
import { DisableResourceTypeItem, EnableResourceTypeItem, MetadataState, ToggleCategoryFilterTab, ToggleResourceTypeItem } from 'src/app/states/metadata.state';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { CheckboxHierarchyDTO } from 'src/app/shared/models/checkboxHierarchy-dto';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-filter-box-item-checkboxHierarchy',
  templateUrl: './filter-box-item-checkboxHierarchy.component.html',
  styleUrls: ['./filter-box-item-checkboxHierarchy.component.scss']
})
export class FilterBoxItemCheckboxHierarchyComponent implements OnInit {
  @Select(MetadataState.getMetadata) metadata$: Observable<any>;
  @Select(MetadataState.getResourceTypeHierarchy) resourceHierarchy$: Observable<CheckboxHierarchyDTO[]>;
  @Select(MetadataState.getActiveNodes) activeNodes$: Observable<string[]>;
  @Select(MetadataState.getActiveCategoryTab) activeCategoryTab$: Observable<number>;

  resourceHierarchy: CheckboxHierarchyDTO[];
  activeTab: number;
  activeNodes: string[]
  @Input() key: string;

  _buckets: any;
  aggregationBuckets: AggregationBucket[] = [];

  @Input() set buckets(values: AggregationBucket[]) {
    this.aggregationBuckets = values;
    this.normalizeAggregationBuckets()
  }
  @Output() changeFilterBuckets: EventEmitter<string[]> = new EventEmitter<string[]>();

  _activeAggregationBuckets: string[] = [];

  @Input() set activeAggregationBuckets(values: string[]) {
    if (values && this.nameIdMap) {
      this._activeAggregationBuckets = values;
      setTimeout(() => {
        this.setActiveFilter();
      }, 50)
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
  treeDataNodeList: CheckboxHierarchyDTO[] = []; //linear list of all nodes

  constructor(private store: Store) { }

  checkboxHierarchyTreeData: CheckboxHierarchyDTO[];

  ngOnInit() {
    this.activeCategoryTab$.subscribe(x => {
      this.activeTab = x;
    })
    this.activeNodes$.subscribe(x => {
      this.activeNodes = x;
    })
    this.resourceHierarchy$.subscribe(r => {
      if (r) {
        this.checkboxHierarchyTreeData = r;
        this.initTree();
      }
    });
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.store.dispatch(new ToggleCategoryFilterTab(tabChangeEvent.index)).subscribe();
    this.emitLastChange();
  }

  initTree() {
    this.AddAllNonInstantiableNodes(this.checkboxHierarchyTreeData)
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<CheckboxHierarchyDTO>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataSource.data = this.checkboxHierarchyTreeData;
    this.rewriteValues();
  }

  setActiveFilter() {
    if (this._activeAggregationBuckets) {
      var idList = []
      this._activeAggregationBuckets.forEach(x => {
        idList = [...idList, ...this.nameIdMap.get(x)]
      })
      this.store.dispatch(new EnableResourceTypeItem(idList)).subscribe();
    }
  }

  AddAllNonInstantiableNodes(nodeList: CheckboxHierarchyDTO[]) {
    nodeList.forEach(node => {
      if (!node.instantiable) {
        var element = {
          "key": node.name,
          "doc_count": 0
        }
        if (!this.aggregationBuckets.some(x => x.key == node.name)) {
          this.aggregationBuckets.push(element)
        }
        this.AddAllNonInstantiableNodes(node.children)
      }
      var idList = this.nameIdMap.get(node.name)
      if (!idList) {
        idList = []
      }
      if (!idList.includes(node.id)) {
        idList.push(node.id)
      }
      this.nameIdMap.set(node.name, idList)

      if ((node.id != null && !this.treeDataNodeList.some(x => x.id == node.id))) {
        this.treeDataNodeList.push(node)
      }
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

    if (!node) {
      return;
    }
    const descendants = this.treeControl.getDescendants(node).filter(x => x.instantiable);
    if (descendants.length > 0) {
      const descAllSelected = descendants.every(child => this.activeNodes.includes(child.id)
      );
      return descAllSelected;
    } else {
      return false;
    }

  }
  categoryAllSelected(node: CheckboxHierarchyDTO): boolean {
    if (!node) {
      return;
    }
    const descAllSelected = node.children.every(child => this.activeNodes.includes(child.id));

    return descAllSelected;
  }
  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: CheckboxHierarchyDTO): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.activeNodes.includes(child.id));
    var jo = result && !this.descendantsAllSelected(node);
    return jo
  }

  /** Toggle the item selection. Select/deselect all the descendants node */
  itemSelectionToggle(node: CheckboxHierarchyDTO, initial: boolean = false): void {
    const descendants = this.treeControl.getDescendants(node);

    var ids = [];
    if (this.descendantsAllSelected(node)) {
      ids = descendants.map(x => x.id);
      descendants.forEach(y => {
        this.treeDataNodeList.forEach(x => {
          if (x.name == y.name && x.id != y.id) {
            ids.push(x.id);
          }
        })
      })
      //ids.push(node.id)
      this.store.dispatch(new DisableResourceTypeItem(ids)).subscribe();
    } else {
      descendants.forEach(y => {
        if (!this.activeNodes.includes(y.id)) {
          ids.push(y.id);
        }
        this.treeDataNodeList.forEach(x => {
          if (x.name == y.name && x.id != y.id && ids.includes(y.id)) {
            ids.push(x.id);
          }
        })
      })
      //ids.push(node.id)
      this.store.dispatch(new EnableResourceTypeItem(ids)).subscribe();

    }
    this.checkAllParentsSelection(node);
    this.emitLastChange(initial);
  }

  /** Toggle a leaf item selection. Check all the parents to see if they changed */
  leafItemSelectionToggle(node: CheckboxHierarchyDTO, initial: boolean = false): void {
    this.store.dispatch(new ToggleResourceTypeItem(node.id)).subscribe();
    this.treeDataNodeList.forEach(x => {
      if (x.name == node.name && x.id != node.id) {
        this.checkAllParentsSelection(x);
        this.store.dispatch(new ToggleResourceTypeItem(x.id)).subscribe();
      }
    })
    this.checkAllParentsSelection(node);
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
    const nodeSelected = this.activeNodes.includes(node.id);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.activeNodes.includes(node.id)
    );
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
      this.treeControl.dataNodes.forEach(s => {
        //if (this.descendantsPartiallySelected(s) || this.checklistSelection.isSelected(s)){
        this.treeControl.expand(s);
        //}
      })
    }
  }

  filterIndexedCheckboxHierarchyItems(treeData: CheckboxHierarchyDTO[], aggregationBuckets: AggregationBucket[]): CheckboxHierarchyDTO[] {
    if (treeData) {

      var indexedItems = treeData.filter(t => aggregationBuckets.some(a => a.key === t.name));
      indexedItems.forEach(i => {
        if (i.hasChild) {
          i.children = this.filterIndexedCheckboxHierarchyItems(i.children, aggregationBuckets);
        }
      });
      const test = indexedItems.filter(ie => (ie.children.length > 0 && ie.hasChild) || (!ie.hasChild));
      return test;
    }
  }



  emitLastChange(initial: boolean = false) {
    if (initial) return;

    const activeBuckets = this.filterDuplicatesAndRemoveChildNodes();
    this.changeFilterBuckets.emit(activeBuckets);
  }

  filterDuplicatesAndRemoveChildNodes(): string[] {
    var result: string[] = [];
    this.treeDataNodeList.forEach(e => {
      if (this.activeNodes.includes(e.id)) {

        if (this.activeTab == 0) {
          if (e.isCategory) {
            var parent = this.treeDataNodeList.find(x => x.name == e.parentName);
            if (this.categoryAllSelected(parent)) {
              result.push(e.id);
            }
          }
        } else {
          result.push(e.id);
        }
      }
    })
    return result
  }
}
