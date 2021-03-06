import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NgModule } from "@angular/core";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { cafRouting } from "./caf.routes";
import { CAFComponent } from "./caf.component";
import { CurrencyEuroPipe } from "../pipes";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    cafRouting
  ],
  declarations: [    
    CAFComponent,
    CurrencyEuroPipe
  ]
})
export class CAFModule {}