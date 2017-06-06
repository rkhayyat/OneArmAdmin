import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NgModule } from "@angular/core";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { authProviders, appRoutes } from "./app.routes";
import { AppComponent } from "./app.component";
import { CurrencyEuroPipe } from "./pipes";
import { BackendService, FirebaseService, UtilsService, CafService } from "./services";
import { MainIhmModule } from "./main/main-ihm.module";
import { AboutUsModule } from "./about-us/about-us.module";
import { LoginModule } from "./login/login.module";
import { ListModule } from "./archive/list/list.module";
import { CatListModule } from "./archive/categories/cat-list.module";
import { ListDetailModule } from "./archive/list-detail/list-detail.module";
import { CAFModule } from "./caf/caf.module";

@NgModule({
  providers: [
    BackendService,
    FirebaseService,
    CafService,
    UtilsService,
    authProviders
  ],
  imports: [
    NativeScriptModule,
    NativeScriptHttpModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forRoot(appRoutes),
    MainIhmModule,
    AboutUsModule,
    LoginModule,
    ListModule,
    CatListModule,
    ListDetailModule,
    CAFModule    
  ],
  declarations: [
      AppComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
