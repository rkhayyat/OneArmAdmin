import {Component, OnInit, ViewChild,ElementRef} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Page} from "ui/page";
import {Location} from "@angular/common";
import {BackendService, CafService} from "../services";
import { TextView } from "ui/text-view";
import {CAF} from "../models";
import {RouterExtensions} from 'nativescript-angular/router/router-extensions';
import {Router} from '@angular/router';
import {confirm} from 'ui/dialogs';
import * as Toast from "nativescript-toast";


@Component({
  moduleId: module.id,
  selector: "gf-caf-list",
  templateUrl: "caf.html"
})
export class CAFComponent implements OnInit {
    id: string;
    date:string;
    // dateValid:string;
    @ViewChild("dateValid") dateValid: ElementRef;
    @ViewChild("seuleNonEnfant") seuleNonEnfant : ElementRef; 
    @ViewChild("coupleNonEnfant") coupleNonEnfant : ElementRef; 
    @ViewChild("seuleUnEnfant") seuleUnEnfant : ElementRef; 
    @ViewChild("coupleUnEnfant") coupleUnEnfant : ElementRef; 
    @ViewChild("seuleDeuxEnfant") seuleDeuxEnfant : ElementRef; 
    @ViewChild("coupleDeuxEnfant") coupleDeuxEnfant : ElementRef; 
    @ViewChild("seuleParEnfantSupp") seuleParEnfantSupp : ElementRef; 
    @ViewChild("coupleParEnfantSupp") coupleParEnfantSupp : ElementRef; 
    @ViewChild("forfaitLogUnePer") forfaitLogUnePer : ElementRef; 
    @ViewChild("forfaitLogDeuxPer") forfaitLogDeuxPer : ElementRef; 
    @ViewChild("forfaitLogTroisPer") forfaitLogTroisPer : ElementRef;
    UID: string ;
    public caf: CAF;
    public caf$: Observable<any>;
    public isAnonymous: boolean;
    public isEditing: boolean;
	
  constructor(private routerExtensions: RouterExtensions,
              private cafService: CafService,
              private router: Router,
              private location: Location) {}

ngOnInit(){
    // this.caf$ = <any>this.firebaseService.getCategoryList();
    this.caf$ = <any>this.cafService.getCafValues();
    // this.caf$.subscribe((result)=>{
    //   if (result.length>0) {
    //       this.id = result[0].id;
    //   }
    // });
    this.isAnonymous = BackendService.isAnonymous;
    this.isEditing = false;
}

back(){
  this.location.back();
}

onEdit(){
  this.isEditing = true;
}
onCancel(){
  this.isEditing = false;
}

    editCaf(){
      let textViewDateValid: TextView = this.dateValid.nativeElement;
      let textViewSeuleNonEnfant: TextView = this.seuleNonEnfant.nativeElement;
      let textViewSeuleUnEnfant: TextView = this.seuleUnEnfant.nativeElement;
      let textViewSeuleDeuxEnfant: TextView = this.seuleDeuxEnfant.nativeElement;
      let textViewSeuleParEnfantSupp: TextView = this.seuleParEnfantSupp.nativeElement;
      let textViewCoupleNonEnfant: TextView = this.coupleNonEnfant.nativeElement;
      let textViewCoupleUnEnfant: TextView = this.coupleUnEnfant.nativeElement;
      let textViewCoupleDeuxEnfant: TextView = this.coupleDeuxEnfant.nativeElement;
      let textViewcoupleParEnfantSupp: TextView = this.coupleParEnfantSupp.nativeElement;
      let textViewforfaitLogUnePer: TextView = this.forfaitLogUnePer.nativeElement;
      let textViewforfaitLogDeuxPer: TextView = this.forfaitLogDeuxPer.nativeElement;
      let textViewForfaitLogTroisPer: TextView = this.forfaitLogTroisPer.nativeElement;
      
      console.log(parseFloat(textViewSeuleNonEnfant.text)+parseFloat(textViewSeuleUnEnfant.text));
        this.cafService.editCaf(this.id, 
                                parseFloat(textViewSeuleNonEnfant.text), 
                                parseFloat(textViewSeuleUnEnfant.text),
                                parseFloat(textViewSeuleDeuxEnfant.text),
                                parseFloat(textViewSeuleParEnfantSupp.text),
                                parseFloat(textViewCoupleNonEnfant.text),
                                parseFloat(textViewCoupleUnEnfant.text),
                                parseFloat(textViewCoupleDeuxEnfant.text),
                                parseFloat(textViewcoupleParEnfantSupp.text),
                                parseFloat(textViewforfaitLogUnePer.text),
                                parseFloat(textViewforfaitLogDeuxPer.text),
                                parseFloat(textViewForfaitLogTroisPer.text),
                                textViewDateValid.text).then((message:any) => {
                                      Toast.makeText(message).show();
                                });
        this.isEditing = false;
    }


    createCaf(dateValid){
              this.cafService.addCaf(dateValid).then((message:any) => {
                                      Toast.makeText(message).show();
                                });
    }
}
