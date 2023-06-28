import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Select } from "@ngxs/store";
import { Observable, Subscription } from "rxjs";
import { MetadataState } from "src/app/states/metadata.state";
import { DocumentMap, SearchHit } from "src/app/shared/models/search-result";
import { DocumentService } from "src/app/core/http/document.service";

export interface DialogData {
  id: string;
  confirmReview: boolean;
}

@Component({
  selector: "app-linked-resource-display-dialog",
  templateUrl: "linked-resource-display-dialog.component.html",
  styleUrls: ["linked-resource-display-dialog.component.scss"],
})
export class LinkedResourceDisplayDialogComponent implements OnInit, OnDestroy {
  private metadataSubscription: Subscription;
  @Select(MetadataState.getMetadata) metadata$: Observable<any>;

  documentData: DialogData;
  document: DocumentMap;
  metadata: any = null;
  hit: SearchHit = null;
  error: string = null;

  constructor(
    private documentService: DocumentService,
    public dialogRef: MatDialogRef<LinkedResourceDisplayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.documentData = data;
  }

  ngOnInit() {
    this.documentService.getDocument(this.documentData.id).subscribe(
      (doc: DocumentMap) => {
        this.document = doc;
        var result = {
          id: this.documentData.id,
          score: 0,
          source: doc,
          highlight: {},
          index: "",
          innerHits: {},
          matchedQueries: [],
          nested: null,
          primaryTerm: null,
          routing: null,
          sequenceNumber: null,
          sorts: [],
          type: "_doc",
          version: 0,
        };
        this.hit = result;
      },
      (error) => {
        if (error.status == 404) {
          this.error =
            "The selected COLID entry could not be found. It may not yet be published to the Data Marketplace.";
        } else {
          this.error = "An unknown error has occurred.";
        }
      }
    );

    this.metadataSubscription = this.metadata$.subscribe((met) => {
      this.metadata = met;
    });
  }

  ngOnDestroy() {
    this.metadataSubscription.unsubscribe();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  openInEditor(): void {
    window.open(this.documentData.id, "_blank");
  }

  confirmReview(): void {
    this.dialogRef.close(true);
  }
}
