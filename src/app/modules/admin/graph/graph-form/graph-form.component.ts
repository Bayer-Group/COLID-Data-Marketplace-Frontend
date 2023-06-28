import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { Select, Store } from "@ngxs/store";
import { ActivatedRoute, Router } from "@angular/router";
import { GraphResultDTO } from "src/app/shared/models/graphs/graph-result-dto";
import { ValidationResult } from "src/app/shared/models/validation/validation-result";
import { HttpErrorResponse } from "@angular/common/http";
import { ColidMatSnackBarService } from "src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service";
import {
  GraphState,
  FetchGraph,
  CreateGraph,
  FetchGraphMetadata,
} from "../../../../states/graph.state";
import { MetaDataProperty } from "src/app/shared/models/metadata/meta-data-property";
import { EntityBase } from "src/app/shared/models/entities/entity-base";
import { Constants } from "src/app/shared/constants";
import { EntityFormStatus } from "src/app/shared/models/entity-form.status";

@Component({
  selector: "app-graph-form",
  templateUrl: "./graph-form.component.html",
  styleUrls: ["./graph-form.component.css"],
})
export class GraphFormComponent {
  @Select(GraphState.getActualGraph) actualGraph$: Observable<GraphResultDTO>;
  @Select(GraphState.getGraphMetadata) graphMetadata$: Observable<
    Array<MetaDataProperty>
  >;

  validationResult: ValidationResult;
  formStatus: EntityFormStatus;

  entityType = Constants.ResourceTypes.MetadataGraphConfiguration;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private snackbar: ColidMatSnackBarService,
    private router: Router
  ) {}

  handleCreateEntityEmitter(entityBase: EntityBase) {
    this.formStatus = EntityFormStatus.LOADING;

    this.store.dispatch(new CreateGraph(entityBase)).subscribe(
      () => {
        this.formStatus = EntityFormStatus.SUCCESS;
        this.store.dispatch(new FetchGraph());
        this.snackbar.success(
          "Created",
          "New metadata graph configuration created successfully"
        );
      },
      (error) => {
        this.handleResponseError(error);
      }
    );
  }

  handleResponseError(error: HttpErrorResponse) {
    this.formStatus = EntityFormStatus.ERROR;

    if (error.status === 400 && error.error && error.error.validationResult) {
      this.validationResult = error.error.validationResult;
    }
  }

  handleCancelEditEntityEmitter() {
    this.store
      .dispatch([new FetchGraphMetadata(), new FetchGraph()])
      .subscribe();
  }
}
