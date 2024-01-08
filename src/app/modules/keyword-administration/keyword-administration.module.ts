import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { KeywordManagementComponent } from "./keyword-management/keyword-management.component";
import { KeywordManagementConfirmationDialogComponent } from "./keyword-management-confirmation-dialog/keyword-management-confirmation-dialog.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { AppMaterialModule } from "src/app/app-material.module";
import { SharedModule } from "src/app/shared/shared.module";

const keywordManagmentRoutes = [
  {
    path: "",
    component: KeywordManagementComponent,
  },
];

const routes: Routes = keywordManagmentRoutes;

@NgModule({
  declarations: [
    KeywordManagementComponent,
    KeywordManagementConfirmationDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    SharedModule,
  ],
})
export class KeywordAdministrationModule {}
