import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardSuperAdminService } from "../authentication/guards/auth-guard-super-admin.service";
import { AdminComponent } from "./admin.component";
import { MessageTemplateComponent } from "./message-template/message-template.component";
import { WelcomeMessageComponent } from "./welcome-message/welcome-message.component";
import { WelcomeMessageEditorComponent } from "./welcome-message/welcome-message-editor/welcome-message-editor.component";
import { WelcomeMessageDataMarketplaceComponent } from "./welcome-message/welcome-message-data-marketplace/welcome-message-data-marketplace.component";
import { BroadcastMessageComponent } from "./broadcast-message/broadcast-message.component";
import { ExcelImportComponent } from "./excel-import/excel-import.component";
import { GraphComponent } from "./graph/graph.component";
import { GraphHistoryComponent } from "./graph/graph-history/graph-history.component";
import { GraphFormComponent } from "./graph/graph-form/graph-form.component";
import { ConsumerGroupComponent } from "./consumer-group/consumer-group.component";
import { ConsumerGroupNewComponent } from "./consumer-group/consumer-group-new/consumer-group-new.component";
import { ConsumerGroupEditComponent } from "./consumer-group/consumer-group-edit/consumer-group-edit.component";
import { ConsumerGroupDisplayComponent } from "./consumer-group/consumer-group-display/consumer-group-display.component";
import { PidUriTemplateComponent } from "./pid-uri-template/pid-uri-template.component";
import { ExtendedUriTemplateComponent } from "./extended-uri-template/extended-uri-template.component";
import { ExtendedUriTemplateDisplayComponent } from "./extended-uri-template/extended-uri-template-display/extended-uri-template-display.component";
import { ExtendedUriTemplateEditComponent } from "./extended-uri-template/extended-uri-template-edit/extended-uri-template-edit.component";
import { ExtendedUriTemplateNewComponent } from "./extended-uri-template/extended-uri-template-new/extended-uri-template-new.component";
import { GraphManagementComponent } from "./graph-management/graph-management.component";
import { LinkHistoryViewComponent } from "./link-history-view/link-history-view.component";
import { DeletionRequestComponent } from "./deletion-request/deletion-request.component";
import { OrphanedIdentifierComponent } from "./orphaned-identifier/orphaned-identifier.component";

const adminRoutes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      {
        path: "messageTemplates",
        component: MessageTemplateComponent,
        canActivate: [AuthGuardSuperAdminService],
      },
      {
        path: "welcomeMessage",
        component: WelcomeMessageComponent,
        children: [
          { path: "edit/editor", component: WelcomeMessageEditorComponent },
          {
            path: "edit/datamarketplace",
            component: WelcomeMessageDataMarketplaceComponent,
          },
          { path: "", pathMatch: "full", redirectTo: "edit/editor" },
        ],
        canActivate: [AuthGuardSuperAdminService],
      },
      {
        path: "broadcastMessage",
        component: BroadcastMessageComponent,
        canActivate: [AuthGuardSuperAdminService],
      },
      {
        path: "excelimport",
        component: ExcelImportComponent,
        canActivate: [AuthGuardSuperAdminService],
      },
      {
        path: "metadata",
        component: GraphComponent,
        children: [
          { path: "history", component: GraphHistoryComponent },
          { path: "", pathMatch: "full", component: GraphFormComponent },
        ],
        canActivate: [AuthGuardSuperAdminService],
      },
      {
        path: "graph",
        component: GraphManagementComponent,
        canActivate: [AuthGuardSuperAdminService],
      },
      {
        path: "consumerGroups",
        component: ConsumerGroupComponent,
        children: [
          { path: "create", component: ConsumerGroupNewComponent },
          { path: "edit", component: ConsumerGroupEditComponent },
          {
            path: "",
            pathMatch: "full",
            component: ConsumerGroupDisplayComponent,
          },
        ],
      },
      {
        path: "extendedUriTemplates",
        component: ExtendedUriTemplateComponent,
        children: [
          { path: "create", component: ExtendedUriTemplateNewComponent },
          { path: "edit", component: ExtendedUriTemplateEditComponent },
          {
            path: "",
            pathMatch: "full",
            component: ExtendedUriTemplateDisplayComponent,
          },
        ],
      },
      { path: "pidUriTemplates", component: PidUriTemplateComponent },
      { path: "linkhistory", component: LinkHistoryViewComponent },
      { path: "deletionrequests", component: DeletionRequestComponent },
      {
        path: "orphanedIdentifiers",
        component: OrphanedIdentifierComponent,
        canActivate: [AuthGuardSuperAdminService],
      },
      {
        path: "agent-statistics",
        loadChildren: () =>
          import("../agent-statistics/agent-statistics.module").then(
            (m) => m.AgentStatisticsModule
          ),
        canActivate: [AuthGuardSuperAdminService],
      },
      { path: "", pathMatch: "full", redirectTo: "consumerGroups" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
