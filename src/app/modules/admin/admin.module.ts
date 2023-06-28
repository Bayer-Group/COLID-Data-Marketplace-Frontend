import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { AdminRoutingModule } from "./admin-routing.module";
import { AppMaterialModule } from "src/app/app-material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AdminComponent } from "./admin.component";
import { AdminTasksComponent } from "./admin-tasks/admin-tasks.component";
import { MessageTemplateComponent } from "./message-template/message-template.component";
import { MessageTemplateEditComponent } from "./message-template/message-template-edit/message-template-edit.component";
import { WelcomeMessageComponent } from "./welcome-message/welcome-message.component";
import { WelcomeMessageEditorComponent } from "./welcome-message/welcome-message-editor/welcome-message-editor.component";
import { WelcomeMessageDataMarketplaceComponent } from "./welcome-message/welcome-message-data-marketplace/welcome-message-data-marketplace.component";
import { WelcomeMessageFormComponent } from "./welcome-message/welcome-message-form/welcome-message-form.component";
import { BroadcastMessageComponent } from "./broadcast-message/broadcast-message.component";
import { ExcelImportComponent } from "./excel-import/excel-import.component";
import { GraphComponent } from "./graph/graph.component";
import { GraphHistoryComponent } from "./graph/graph-history/graph-history.component";
import { GraphFormComponent } from "./graph/graph-form/graph-form.component";
import { ConsumerGroupComponent } from "./consumer-group/consumer-group.component";
import { ConsumerGroupNewComponent } from "./consumer-group/consumer-group-new/consumer-group-new.component";
import { ConsumerGroupFormComponent } from "./consumer-group/consumer-group-form/consumer-group-form.component";
import { ConsumerGroupEditComponent } from "./consumer-group/consumer-group-edit/consumer-group-edit.component";
import { ConsumerGroupDisplayComponent } from "./consumer-group/consumer-group-display/consumer-group-display.component";

import { PidUriTemplateComponent } from "./pid-uri-template/pid-uri-template.component";
import { PidUriTemplateTableComponent } from "./pid-uri-template/pid-uri-template-table/pid-uri-template-table.component";

import { ExtendedUriTemplateComponent } from "./extended-uri-template/extended-uri-template.component";
import { ExtendedUriTemplateNewComponent } from "./extended-uri-template/extended-uri-template-new/extended-uri-template-new.component";
import { ExtendedUriTemplateFormComponent } from "./extended-uri-template/extended-uri-template-form/extended-uri-template-form.component";
import { ExtendedUriTemplateEditComponent } from "./extended-uri-template/extended-uri-template-edit/extended-uri-template-edit.component";
import { ExtendedUriTemplateDisplayComponent } from "./extended-uri-template/extended-uri-template-display/extended-uri-template-display.component";

import { GraphManagementComponent } from "./graph-management/graph-management.component";
import { GraphUploadDialogComponent } from "./graph-management/graph-upload-dialog/graph-upload-dialog.component";
import { GraphFileUploadComponent } from "./graph-management/graph-file-upload/graph-file-upload.component";

import { LinkHistoryViewComponent } from "./link-history-view/link-history-view.component";
import { LinkHistoryComponent } from "./link-history-view/link-history/link-history.component";

import { DeletionRequestComponent } from "./deletion-request/deletion-request.component";
import { DeletionRequestDialogComponent } from "./deletion-request/deletion-request-dialog/deletion-request-dialog.component";

import { OrphanedIdentifierComponent } from "./orphaned-identifier/orphaned-identifier.component";

@NgModule({
  declarations: [
    AdminComponent,
    AdminTasksComponent,
    MessageTemplateComponent,
    MessageTemplateEditComponent,
    WelcomeMessageComponent,
    WelcomeMessageEditorComponent,
    WelcomeMessageDataMarketplaceComponent,
    WelcomeMessageFormComponent,
    BroadcastMessageComponent,
    ExcelImportComponent,
    GraphComponent,
    GraphHistoryComponent,
    GraphFormComponent,
    ConsumerGroupComponent,
    ConsumerGroupNewComponent,
    ConsumerGroupFormComponent,
    ConsumerGroupEditComponent,
    ConsumerGroupDisplayComponent,
    PidUriTemplateComponent,
    PidUriTemplateTableComponent,
    ExtendedUriTemplateComponent,
    ExtendedUriTemplateNewComponent,
    ExtendedUriTemplateFormComponent,
    ExtendedUriTemplateEditComponent,
    ExtendedUriTemplateDisplayComponent,
    GraphManagementComponent,
    GraphUploadDialogComponent,
    GraphFileUploadComponent,
    LinkHistoryViewComponent,
    DeletionRequestComponent,
    DeletionRequestDialogComponent,
    OrphanedIdentifierComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    LinkHistoryComponent,
  ],
  exports: [AdminComponent],
})
export class AdminModule {}
