import {Component, OnInit} from '@angular/core';
import {User} from '../models/user.model';
import {FirebaseService} from '../services';
import {Router} from '@angular/router';
import {RouterExtensions} from 'nativescript-angular/router/router-extensions';
import {Location} from "@angular/common";
var appversion = require("nativescript-appversion");


@Component({
  moduleId: module.id,
  selector: 'gf-about-us',
  templateUrl: 'about-us.html'
})
export class AboutUsComponent implements OnInit{
  textHtml1: string;
  textHtml2: string;
  selectedIndex:number;
  constructor(private router: Router, 
              private firebaseService: FirebaseService,
              private routerExtensions:RouterExtensions,
              private location:Location) {

 }

ngOnInit(){
    this.selectedIndex =1;
    this.textHtml1 = "<b>من نحن:</b> <br><br> "
    this.textHtml1 += "منذ عام 2014 أُنشئت مجموعة منتدى السوريين في فرنسا على الفيسبوك لتكون الصفحة التي تجمع السوريين بشكل خاص والعرب بشكل عام المتواجدين على الأراضي الفرنسية  .<br><br>";
    this.textHtml1 += "كان الهدف الأساسي لهذه المجموعة ومازال تبادل التجارب والخبرات بين السوريين فيما بينهم والعرب وخاصة في مجال الدراسة والعمل والأمور الإدارية <br><br>";
    this.textHtml1 += "وبعد مضي أكثر من ثلاث سنوات على إنشاء المجموعة توافر عدد كبير من المقالات والمشاركات من تجارب الأعضاء وحتى لا تضيع هذه المشاركات قررنا إطلاق مبادرة إيد وحدة <br><br>";
    this.textHtml1 += "مبادرة إيد وحدة عبارة عن تطبيق للهواتف المحمولة الذكية أندرويد وأيفون. هدفه في مرحلته الأولى جمع أرشيف منتدى السوريين في فرنسا وجعله متاحاً للجميع عبر الإنترنت دون الحاجة للبحث عنه ضمن صفحات الفيسبوك، كما ويشتمل التطبيق على قسم خاص للمشرفين يمكّنهم من إنشاء وتعديل وحذف جميع المقالات المتوفرة. <br><br>"
    this.textHtml1 += "العمل ما زال في مراحله الأولى والتطبيق لن ينحصر على جمع الأرشيف بل سيترافقه مراحل وميزات أخرى لتساعد المهاجرين في غربتهم";
    this.textHtml2 = "<b> رقم النسخة ";

    appversion.getVersionName().then((v: string) =>{
      this.textHtml2 += v + " </b>";
    });
    
}

back(){
  this.location.back();
}
logout() {
    this.firebaseService.logout();
    this.routerExtensions.navigate(["/login"], { clearHistory: true } );
  }

}
