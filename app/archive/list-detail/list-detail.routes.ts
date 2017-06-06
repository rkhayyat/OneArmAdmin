import { ModuleWithProviders }  from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListDetailComponent } from "./list-detail.component";
import { AuthGuard } from "../../auth-guard.service";

const listDetailRoutes: Routes = [
  { path: "list-detail/:id/:categoryTitle/:searchWord", component: ListDetailComponent, canActivate: [AuthGuard] },
];
export const listDetailRouting: ModuleWithProviders = RouterModule.forChild(listDetailRoutes);