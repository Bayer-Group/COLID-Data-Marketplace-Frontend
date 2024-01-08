import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatListOption } from "@angular/material/list";
import { Select, Store } from "@ngxs/store";
import { Observable, Subscription } from "rxjs";
import { DocumentService } from "src/app/core/http/document.service";
import { SearchClusterResults } from "src/app/shared/models/search-cluster-result";
import { MetadataState } from "src/app/states/metadata.state";
import {
  AddSelectedPIDURI,
  AddSelectedPIDURIs,
  ClearSelectedPIDURIs,
  RemoveSelectedPIDURI,
  SearchState,
} from "src/app/states/search.state";

interface ClusterSearchResultMapping {
  [key: string]: {
    pidUris: string[];
    totalResultCount: number;
  };
}

@Component({
  selector: "app-clustering-wrapper",
  templateUrl: "./clustering-wrapper.component.html",
  styleUrls: ["./clustering-wrapper.component.scss"],
})
export class ClusteringWrapperComponent implements OnInit {
  masterSub: Subscription = new Subscription();
  @Select(SearchState.getLoadingClusters)
  isLoadingClusters$: Observable<boolean>;
  @Select(MetadataState.getMetadata) metadata$: Observable<any>;
  metadata;
  @Select(SearchState.getClusteredResults)
  clusteredResults$: Observable<SearchClusterResults>;
  @Select(SearchState.getSelectedPIDURIs) selectedPIDURIs$: Observable<
    string[]
  >;

  @Output() selectedClusterPidUris = new EventEmitter<string[]>();

  clusteredResultsMapping: ClusterSearchResultMapping = {};
  currentlySelectedCluster: string = "";
  currentlyDisplayedSearchResultPidUris: string[] = [];
  selectedPidUris: string[] = [];
  searchResults = [];
  loadingSearchResults = false;

  constructor(private documentService: DocumentService, private store: Store) {}

  ngOnInit(): void {
    this.masterSub.add(
      this.metadata$.subscribe((metadata) => {
        this.metadata = metadata;
      })
    );
    this.masterSub.add(
      this.selectedPIDURIs$.subscribe((selectedPidUris) => {
        this.selectedPidUris = selectedPidUris;
      })
    );
    this.masterSub.add(
      this.clusteredResults$.subscribe((clusteredResults) => {
        if (clusteredResults != null && clusteredResults.clusters.length > 0) {
          clusteredResults.clusters.forEach((cluster) => {
            this.clusteredResultsMapping[cluster.labels[0]] = {
              pidUris: cluster.docDetails.map((d) => d.pidUri),
              totalResultCount: cluster.docDetails.length,
            };
          });
          this.currentlySelectedCluster =
            clusteredResults.clusters[0].labels[0];
          this.selectedClusterPidUris.emit(
            this.clusteredResultsMapping[this.currentlySelectedCluster].pidUris
          );
          this.loadFirstBulkOfSearchResultsOfACluster(
            this.currentlySelectedCluster
          );
        }
      })
    );
  }

  selectedClusterChanged(options: MatListOption[]) {
    this.currentlySelectedCluster = options[0].value;
    this.selectedClusterPidUris.emit(
      this.clusteredResultsMapping[this.currentlySelectedCluster].pidUris
    );
    this.store.dispatch(new ClearSelectedPIDURIs());
    this.loadFirstBulkOfSearchResultsOfACluster(this.currentlySelectedCluster);
  }

  checkboxChanged(event: MatCheckboxChange, pidUri: string) {
    event.source.checked
      ? this.store.dispatch(new AddSelectedPIDURI(pidUri))
      : this.store.dispatch(new RemoveSelectedPIDURI(pidUri));
  }

  selectAllCheckboxChanged(event: MatCheckboxChange) {
    if (event.checked) {
      const pidUris =
        this.clusteredResultsMapping[this.currentlySelectedCluster].pidUris;
      console.log(pidUris);
      this.store.dispatch(new AddSelectedPIDURIs(pidUris));
    } else {
      this.store.dispatch(new ClearSelectedPIDURIs());
    }
  }

  loadNextBatch() {
    if (this.loadingSearchResults) {
      return;
    }
    if (
      this.searchResults.length >=
      this.clusteredResultsMapping[this.currentlySelectedCluster]
        .totalResultCount
    ) {
      return;
    }
    this.loadNextBulkOfSearchResultsOfACluster(this.currentlySelectedCluster);
  }

  private loadFirstBulkOfSearchResultsOfACluster(clusterName: string) {
    this.loadingSearchResults = true;
    this.searchResults = [];
    this.currentlyDisplayedSearchResultPidUris = this.clusteredResultsMapping[
      clusterName
    ].pidUris.slice(0, 20);
    this.documentService
      .getDocuments(this.currentlyDisplayedSearchResultPidUris)
      .subscribe((searchResults) => {
        this.searchResults = searchResults;
        this.loadingSearchResults = false;
      });
  }

  private loadNextBulkOfSearchResultsOfACluster(clusterName: string) {
    const currentlyLoadedSearchResultsCount = this.searchResults.length;
    const nextSearchResultPidUrisToLoad = this.clusteredResultsMapping[
      clusterName
    ].pidUris.slice(
      currentlyLoadedSearchResultsCount,
      currentlyLoadedSearchResultsCount + 20
    );
    this.documentService
      .getDocuments(nextSearchResultPidUrisToLoad)
      .subscribe((results) => {
        this.searchResults = this.searchResults.concat(results);
      });
  }
}
