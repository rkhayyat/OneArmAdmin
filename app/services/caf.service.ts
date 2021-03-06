import {Injectable, NgZone} from "@angular/core";
import {CAF} from "../models";
import { BackendService } from "./backend.service";
import firebase = require("nativescript-plugin-firebase");
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {UtilsService} from './utils.service';
import 'rxjs/add/operator/share';
import * as Toast from "nativescript-toast";

@Injectable()
export class CafService {
  constructor(
    private ngZone: NgZone,
    private utils: UtilsService
  ){}

items: BehaviorSubject<Array<CAF>> = new BehaviorSubject([]);    
private _allItems: Array<CAF> = [];
  addCaf(dateValid: string) { 

    return firebase.push(
        "/Caf",
        {   "seuleNonEnfant":0,
            "seuleUnEnfant":0,
            "seuleDeuxEnfant":0,
            "seuleParEnfantSupp":0,
            "coupleNonEnfant":0,
            "coupleUnEnfant":0,
            "coupleDeuxEnfant":0,
            "coupleParEnfantSupp":0,
            "date":0 - Date.now(),
            "dateValid":dateValid,
            "forfaitLogUnePer":0,
            "forfaitLogDeuxPer":0,
            "forfaitLogTroisPer":0}
      ).then(
        function (result:any) {

          return 'تم إضافة جدول للكاف بقيم صفرية';

        },
        function (errorMessage:any) {
          console.log(errorMessage);
        }); 
   }

editCaf(id:string, 
        seuleNonEnfant: number, 
        seuleUnEnfant: number,
        seuleDeuxEnfant: number,
        seuleParEnfantSupp: number,
        coupleNonEnfant: number,
        coupleUnEnfant: number,
        coupleDeuxEnfant: number,
        coupleParEnfantSupp: number,
        forfaitLogUnePer: number,
        forfaitLogDeuxPer: number,
        forfaitLogTroisPer: number,
        dateValid:string
        ){
    this.publishUpdates();
    return firebase.update("/Caf/"+id+"",{
        "seuleNonEnfant":seuleNonEnfant,
            "seuleUnEnfant":seuleUnEnfant,
            "seuleDeuxEnfant":seuleDeuxEnfant,
            "seuleParEnfantSupp":seuleParEnfantSupp,
            "coupleNonEnfant":coupleNonEnfant,
            "coupleUnEnfant":coupleUnEnfant,
            "coupleDeuxEnfant":coupleDeuxEnfant,
            "coupleParEnfantSupp":coupleParEnfantSupp,
            "dateValid":dateValid,
            "forfaitLogUnePer":forfaitLogUnePer,
            "forfaitLogDeuxPer":forfaitLogDeuxPer,
            "forfaitLogTroisPer":forfaitLogTroisPer})
      .then(
        function (result:any) {
          return 'قمت بنجاح بتعديل جدول الكاف';
        },
        function (errorMessage:any) {
          console.log(errorMessage);
        });  
  }

publishUpdates() {
    // here, we sort must emit a *new* value (immutability!)
    this._allItems.sort(function(a, b){
        if(a.date < b.date) return -1;
        if(a.date > b.date) return 1;
      return 0;
    })
    this.items.next([...this._allItems]);
  }

getCafValues(): Observable<any> {

    return new Observable((observer: any) => {
      let path = "Caf";
      
        let onValueEvent = (snapshot: any) => {
          this.ngZone.run(() => {
            let results = this.handleSnapshot(snapshot.value);
             observer.next(results);
          });
        };
        firebase.addValueEventListener(onValueEvent, `/${path}`);
    }).share();              
  }

handleSnapshot(data: any) {
    //empty array, then refill and filter
    this._allItems = [];
    if (data) {

      for (let id in data) {        
        let result = (<any>Object).assign({id: id}, data[id]);
        
        this._allItems.push(result);
      }
      this.publishUpdates();
    }
    return this._allItems;
  }

}

        
        