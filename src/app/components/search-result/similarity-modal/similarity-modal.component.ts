import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Constants } from "src/app/shared/constants";
import { Select } from "@ngxs/store";
import { SimilarityService } from "src/app/core/http/similarity.service";
import { Observable, Subscription } from "rxjs";
import { MetadataState } from "src/app/states/metadata.state";
import { DocumentMap } from "src/app/shared/models/search-result";
import { DocumentService } from "src/app/core/http/document.service";
import { SearchHit } from "src/app/shared/models/search-result";

@Component({
  selector: "app-similarity-modal",
  templateUrl: "./similarity-modal.component.html",
  styleUrls: ["./similarity-modal.component.scss"],
})
export class SimilarityModalComponent implements OnInit, OnDestroy {
  docs: any[] = [];
  threshold: number = 0;
  loading: boolean = true;

  private metadataSubscription: Subscription;
  @Select(MetadataState.getMetadata) metadata$: Observable<any>;

  constants = Constants;
  pidUri: string = "";
  source: object = {};

  documents: DocumentMap[] = [];
  searchHits: SearchHit[] = [];
  metadata: any = null;

  error: string = null;

  constructor(
    public dialogRef: MatDialogRef<SimilarityModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private documentService: DocumentService,
    private similarityService: SimilarityService
  ) {}

  ngOnInit() {
    this.pidUri = this.data.pidUri;
    this.source = this.data.source;

    this.metadata$.subscribe((met) => {
      this.metadata = met;
    });

    this.loadSimilarResources();
  }

  get returnedPids() {
    return this.searchHits.map((doc) => {
      return doc.id;
    });
  }

  loadSimilarResources() {
    this.similarityService
      .loadSimilarityResourceByResource(this.generatePayload())
      .subscribe(
        (data) => {
          this.threshold = data.next_threshold;
          this.docs = data.docs;

          data.docs.forEach((element) => {
            let pidUri = element[Constants.Metadata.HasPidUri];
            this.documentService.getDocument(pidUri).subscribe(
              (doc: DocumentMap) => {
                this.documents.push(doc);

                let searchHit = new SearchHit();
                searchHit.id = pidUri;
                searchHit.score = 0.0;
                searchHit.source = doc;

                this.searchHits.push(searchHit);
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
          });

          this.loading = false;
        },
        (_error) => {
          this.error = "An unknown error has occurred.";
          this.loading = false;
        }
      );
  }

  ngOnDestroy() {
    this.metadataSubscription.unsubscribe();
  }

  private generatePayload() {
    let payload = {
      id: "",
      properties: {},
    };

    payload.properties[Constants.Metadata.HasPidUri] =
      this.source[Constants.Metadata.HasPidUri].outbound[0].value;

    if (
      typeof this.source[Constants.Metadata.HasResourceDefinition] !=
      "undefined"
    ) {
      payload.properties[Constants.Metadata.HasResourceDefinition] =
        this.source[Constants.Metadata.HasResourceDefinition].outbound[0].value;
    } else {
      payload.properties[Constants.Metadata.HasResourceDefinition] = "";
    }

    if (typeof this.source[Constants.Metadata.HasLabel] != "undefined") {
      payload.properties[Constants.Metadata.HasLabel] =
        this.source[Constants.Metadata.HasLabel].outbound[0].value;
    } else {
      payload.properties[Constants.Metadata.HasLabel] = "";
    }

    if (typeof this.source[Constants.Metadata.EntityType] != "undefined") {
      payload.properties[Constants.Metadata.EntityType] =
        this.source[Constants.Metadata.EntityType].outbound[0].uri;
    } else {
      payload.properties[Constants.Metadata.EntityType] = "";
    }

    if (
      typeof this.source[Constants.Metadata.HasPIDEditorialNote] != "undefined"
    ) {
      payload.properties[Constants.Metadata.HasPIDEditorialNote] =
        this.source[Constants.Metadata.HasPIDEditorialNote].outbound[0].value;
    } else {
      payload.properties[Constants.Metadata.HasPIDEditorialNote] = "";
    }

    return payload;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
