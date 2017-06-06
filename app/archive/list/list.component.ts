import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import {Location} from "@angular/common";
import {Page} from "ui/page";
import { TextView } from "ui/text-view";
import {BackendService, FirebaseService} from "../../services";
import {Article} from "../../models";
import {RouterExtensions} from 'nativescript-angular/router/router-extensions';
import {Router, ActivatedRoute} from '@angular/router';
import {confirm} from "ui/dialogs";
import {screen} from "platform";
import * as Toast from "nativescript-toast";


@Component({
  moduleId: module.id,
  selector: "gf-list",
  templateUrl: "list.html"
})
export class ListComponent implements OnInit {

  @ViewChild("mySearch") mySearch: ElementRef; 
  @ViewChild("newArticle") newArticle: ElementRef; 
  @ViewChild("sb") sb: ElementRef; 

  id: string;
  title: string;
  date: string;
  text: string;
  imagepath: string;
  tag:[string];
  UID: string;
  catId: string;
  searchWord:string;
  articleListHeightVisister:number;
  articleListHeightAdmin:number;
  // private sub: any;
  public article: Article;
  public categoryTitle:string;
  public isAnonymous:boolean;
  private sub$: Observable<any>;
  public articles$: Observable<any>;
  isLoading:boolean;
  constructor(private routerExtensions: RouterExtensions,
              private route: ActivatedRoute,
              private firebaseService: FirebaseService,
              private router: Router,
              private location: Location
    ) {}

ngOnInit(){
  // this.location.subscribe(()=>{
  //    this.articles$ = <any>this.firebaseService.getArticleList(this.catId,'');
  // });

  this.isLoading= true;
  this.isAnonymous = BackendService.isAnonymous;
  this.sub$ = this.route.params;
  this.articles$ = this.sub$.switchMap((params: any) => {
                              this.catId = params['id'];
                              this.categoryTitle = params['categoryTitle'];
                              return <any>this.firebaseService.getArticleList(params['id'],'')});	

    this.articles$.subscribe(()=>{
           this.isLoading= false;
 });
  // this.isAnonymous = BackendService.isAnonymous;
  //  this.sub = this.route.params.subscribe((params: any) => {
  //     this.catId = params['id'];
  //     this.categoryTitle = params['categoryTitle'];
      
      
  //         this.articles$ = <any>this.firebaseService.getArticleList(this.catId,'');
          
  //   });
}

  add() {
     this.article = new Article(
       this.id,
        this.title,
        this.categoryTitle,
        this.date,
        this.text,
        this.imagepath,
        this.tag,
        this.UID 
      )
    let myArticle:string = this.article.title;
    let myCategoryId:string = this.catId;
    let textViewNewArticle: TextView = this.newArticle.nativeElement;
    textViewNewArticle.dismissSoftInput();//close the keyboard
    this.firebaseService.add(myArticle, myCategoryId).then((message:any) => {
      this.title = "";
      Toast.makeText(message).show();
      
    });
    
  }
  
onSubmit(value){
  
 let textViewMySearch : TextView = this.sb.nativeElement;
  if (textViewMySearch.ios) {
      textViewMySearch.ios.endEditing(true);
      textViewMySearch.dismissSoftInput();//close the keyboard
} else if (textViewMySearch.android) {
      textViewMySearch.android.setFocusable(false);
      textViewMySearch.android.clearFocus();
      textViewMySearch.dismissSoftInput();//close the keyboard
  }
  this.articles$ = <any>this.firebaseService.getArticleList(this.catId,value);
}

back(){
  // if (this.isAnonymous) {
  //   let textViewMySearch : TextView = this.sb.nativeElement;
  //   textViewMySearch.android.clearFocus();
  //   textViewMySearch.dismissSoftInput();//close the keyboard
  // }
  
  this.location.back();
}
goHome(){
  this.routerExtensions.navigate(["/"], { clearHistory: true } );
}
  delete(article: Article) {
    confirm({
      title: "تأكيد حذف المقال",
      message: "في حال حذف هذا المقال لن تتمكن من استرجاعه",
      okButtonText: "موافق",
      cancelButtonText: "غير موافق",
    }).then(result => {
       if (result) {
        // //  console.log(article.imagepath);
        // //  if (article.imagepath !=="") {
        //     this.firebaseService.deleteImage('jjj')
        //     .catch(() => {
        //       alert("An error occurred while deleting image");
        //     });
        // //  }
         
          this.firebaseService.delete(article)
          .catch(() => {
          alert("An error occurred while deleting an item from your list.");
        });
        

        }
    });   
  }

  viewDetail(id: string, categoryTitle:string){
    if (this.isAnonymous) {
      this.router.navigate(["/list-detail", id, categoryTitle,this.searchWord]);
    } else {
      this.router.navigate(["/list-detail", id, categoryTitle,'']);
    }
  }

  logout() {
    this.firebaseService.logout();
    this.routerExtensions.navigate(["/login"], { clearHistory: true } );
  }
}

