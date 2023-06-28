import { ColidSpinnerComponent } from "./components/colid-spinner/colid-spinner.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { QuillModule, QuillConfig } from "ngx-quill";

import { DebounceDirective } from "./directives/debounce.directive";
import { EditorAccessControlDirective } from "./directives/editor-access-control.directive";

import { MetadataGroupByPipe } from "./pipes/metadata-group-by.pipe";
import { LastIndexStringPipe } from "./pipes/last-index-string.pipe";
import { PrettySizePipe } from "./pipes/pretty-size.pipe";
import { MapPipe } from "./pipes/map.pipe";
import { JoinPipe } from "./pipes/join.pipe";
import { HighlightPipe } from "./pipes/highlight.pipe";
import { BypassSanitizerPipe } from "./pipes/bypassSanitizer.pipe";
import { ReviewCyclePipe } from "./pipes/review-cycle.pipe";
import { LoadingIndicatorPipe } from "./pipes/loadingIndicator.pipe";
import { ColumnsNamePipe } from "./pipes/columnsName.pipe";
import { RemoveHtmlTagsPipe } from "./pipes/remove-html-tags.pipe";

import { ActionButtonComponent } from "./components/action-button/action-button.component";
import { EntityFormComponent } from "./components/entity-form/entity-form.component";

import { EntityDisplayComponent } from "./components/entity-display/entity-display.component";
import { EntityDisplayImageComponent } from "./components/entity-display/entity-display-image/entity-display-image.component";
import { EntityDisplayGroupComponent } from "./components/entity-display/entity-display-group/entity-display-group.component";
import { EntityDisplayItemComponent } from "./components/entity-display/entity-display-item/entity-display-item.component";
import { EntityDisplayItemTaxonomyComponent } from "./components/entity-display/entity-display-item-taxonomy/entity-display-item-taxonomy.component";
import { EntityDisplayItemVersioningComponent } from "./components/entity-display/entity-display-item-versioning/entity-display-item-versioning.component";

import { FormComponent } from "./components/form/form.component";
import { FormItemComponent } from "./components/form-item/form-item.component";
import { FormItemCreateAttachmentComponent } from "./components/form-item/form-item-create/form-item-create-attachment/form-item-create-attachment.component";
import { FormItemCreateDistributionComponent } from "./components/form-item/form-item-create/form-item-create-distribution/form-item-create-distribution.component";
import { FormItemCreateNestedComponent } from "./components/form-item/form-item-create/form-item-create-nested/form-item-create-nested.component";
import { FormItemErrorsComponent } from "./components/form-item/form-item-errors/form-item-errors.component";
import { FormItemInputAttachmentComponent } from "./components/form-item/form-item-input/form-item-input-attachment/form-item-input-attachment.component";
import { FormItemInputBaseComponent } from "./components/form-item/form-item-input/form-item-input-base/form-item-input-base.component";
import { FormItemInputCheckboxComponent } from "./components/form-item/form-item-input/form-item-input-checkbox/form-item-input-checkbox.component";
import { FormItemInputDatetimeComponent } from "./components/form-item/form-item-input/form-item-input-datetime/form-item-input-datetime.component";
import { FormItemInputDistributionComponent } from "./components/form-item/form-item-input/form-item-input-distribution/form-item-input-distribution.component";
import { FormItemInputGeneralComponent } from "./components/form-item/form-item-input/form-item-input-general/form-item-input-general.component";
import { FormItemInputGeneralMultiComponent } from "./components/form-item/form-item-input/form-item-input-general-multi/form-item-input-general-multi.component";
import { FormItemInputHtmlComponent } from "./components/form-item/form-item-input/form-item-input-html/form-item-input-html.component";
import { FormItemInputMultiselectComponent } from "./components/form-item/form-item-input/form-item-input-multiselect/form-item-input-multiselect.component";
import { FormItemInputNestedComponent } from "./components/form-item/form-item-input/form-item-input-nested/form-item-input-nested.component";
import { FormItemInputNumberComponent } from "./components/form-item/form-item-input/form-item-input-number/form-item-input-number.component";
import { FormItemInputPersonComponent } from "./components/form-item/form-item-input/form-item-input-person/form-item-input-person.component";
import { FormItemInputPidUriComponent } from "./components/form-item/form-item-input/form-item-input-pid-uri/form-item-input-pid-uri.component";
import { FormItemInputTaxonomyComponent } from "./components/form-item/form-item-input/form-item-input-taxonomy/form-item-input-taxonomy.component";

import { DeleteItemDialogComponent } from "./components/delete-item-dialog/delete-item-dialog.component";
import { ConfirmationDialogComponent } from "./components/confirmation-dialog/confirmation-dialog.component";
import { EntityHistoricComponent } from "./components/entity-historic/entity-historic.component";
import { AppMaterialModule } from "../app-material.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Global quill config for form items
const globalQuillConfig: QuillConfig = {
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      ["clean"], // remove formatting button
      ["link"], // link
    ],
  },
};

@NgModule({
  declarations: [
    DebounceDirective,
    LastIndexStringPipe,
    JoinPipe,
    MapPipe,
    BypassSanitizerPipe,
    PrettySizePipe,
    HighlightPipe,
    MetadataGroupByPipe,
    RemoveHtmlTagsPipe,
    ReviewCyclePipe,
    LoadingIndicatorPipe,
    ColumnsNamePipe,
    ColidSpinnerComponent,
    EditorAccessControlDirective,
    ActionButtonComponent,
    DeleteItemDialogComponent,
    ConfirmationDialogComponent,
    EntityHistoricComponent,
    FormItemComponent,
    EntityFormComponent,
    EntityDisplayComponent,
    EntityDisplayGroupComponent,
    EntityDisplayImageComponent,
    EntityDisplayItemComponent,
    EntityDisplayItemTaxonomyComponent,
    EntityDisplayItemVersioningComponent,
    FormComponent,
    FormItemCreateAttachmentComponent,
    FormItemCreateDistributionComponent,
    FormItemCreateNestedComponent,
    FormItemErrorsComponent,
    FormItemInputAttachmentComponent,
    FormItemInputBaseComponent,
    FormItemInputCheckboxComponent,
    FormItemInputDatetimeComponent,
    FormItemInputDistributionComponent,
    FormItemInputGeneralComponent,
    FormItemInputGeneralMultiComponent,
    FormItemInputHtmlComponent,
    FormItemInputMultiselectComponent,
    FormItemInputNestedComponent,
    FormItemInputNumberComponent,
    FormItemInputPersonComponent,
    FormItemInputPidUriComponent,
    FormItemInputTaxonomyComponent,
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    QuillModule.forRoot(globalQuillConfig),
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    DebounceDirective,
    LastIndexStringPipe,
    PrettySizePipe,
    JoinPipe,
    RemoveHtmlTagsPipe,
    HighlightPipe,
    BypassSanitizerPipe,
    MetadataGroupByPipe,
    ReviewCyclePipe,
    LoadingIndicatorPipe,
    ColumnsNamePipe,
    QuillModule,
    NgSelectModule,
    ColidSpinnerComponent,
    EditorAccessControlDirective,
    ActionButtonComponent,
    ConfirmationDialogComponent,
    EntityHistoricComponent,
    FormComponent,
    FormItemComponent,
    DeleteItemDialogComponent,
    EntityFormComponent,
    EntityDisplayComponent,
    EntityDisplayGroupComponent,
    EntityDisplayImageComponent,
    EntityDisplayItemComponent,
    EntityDisplayItemTaxonomyComponent,
    EntityDisplayItemVersioningComponent,
    FormItemInputAttachmentComponent,
    FormItemInputBaseComponent,
    FormItemInputCheckboxComponent,
    FormItemInputDatetimeComponent,
    FormItemInputDistributionComponent,
    FormItemInputGeneralComponent,
    FormItemInputGeneralMultiComponent,
    FormItemInputHtmlComponent,
    FormItemInputMultiselectComponent,
    FormItemInputNestedComponent,
    FormItemInputNumberComponent,
    FormItemInputPersonComponent,
    FormItemInputPidUriComponent,
    FormItemInputTaxonomyComponent,
  ],
})
export class SharedModule {}
