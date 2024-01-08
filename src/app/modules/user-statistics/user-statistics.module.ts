import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { UserStatisticsViewComponent } from "./user-statistics-view/user-statistics-view.component";
import { SankeyComponent } from "./user-statistics-view/sankey/sankey.component";

const userStatisticsRoute = [
  {
    path: "",
    component: UserStatisticsViewComponent,
  },
];

const routes: Routes = userStatisticsRoute;

@NgModule({
  declarations: [UserStatisticsViewComponent, SankeyComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class UserStatisticsModule {}
