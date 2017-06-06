import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Page} from "ui/page";
import {Location} from "@angular/common";
import {BackendService, FirebaseService} from "../../services";
import { TextView } from "ui/text-view";
import {Category} from "../../models";
import {RouterExtensions} from 'nativescript-angular/router/router-extensions';
import {Router} from '@angular/router';
import {confirm} from 'ui/dialogs';
import * as Toast from "nativescript-toast";


@Component({
  moduleId: module.id,
  selector: "gf-cat-list",
  templateUrl: "cat-list.html"
})
export class CatListComponent implements OnInit {

  @ViewChild("newCategory") newCategory: ElementRef;

    id: string;
    title: string;
    date: string;
    description:string;
    orderNumber:string;
    orderNumberInput:string;
    UID: string ;
    public category: Category;
    public category$: Observable<any>;
	  private articles$: Observable<any>;
    public isAnonymous: boolean;
	  isLoading:boolean;
  constructor(private routerExtensions: RouterExtensions,
              private firebaseService: FirebaseService,
              private router: Router,
              private location: Location) {}

ngOnInit(){
    this.category$ = <any>this.firebaseService.getCategoryList();
    this.isLoading= true;   
    this.category$.subscribe(()=>{
          this.isLoading= false;
    });
    this.isAnonymous = BackendService.isAnonymous;
}

back(){
  this.location.back();
}

add() {
    // console.log(this.category$[0]);
     this.category = new Category(
        this.id,
        this.title,
        this.date,
        this.description,
        this.orderNumber,
        this.UID 
      )
      
    let myCategory:string = this.category.title;
    let textViewNewCategory: TextView = this.newCategory.nativeElement;
    textViewNewCategory.dismissSoftInput();//close the keyboard
    let orderNumber:number;
    this.firebaseService.queryCategoryList().subscribe(category => {
      orderNumber = parseInt(category[0].orderNumber) + 1
      this.firebaseService.addCategory(myCategory, String(orderNumber)).then((message:any) => {
        this.title = "";
        Toast.makeText(message).show();
    })   
    })

    
  }
     delete(category: Category) {
	 
	 this.articles$ = <any>this.firebaseService.queryArticleList(category.id);
	  this.articles$.subscribe(articles => {
			
			if (articles.length > 0) {
				if (articles.length ===1) {
					alert({title: "تنبيه",message: "يوجد مقالة واحدة مرتبطة بهذا القسم، يجب حذفها أولاً", okButtonText: "موافق"});
				} else if (articles.length ===2) {
					alert({title: "تنبيه",message: "يوجد مقالتين مرتبطتين بهذا القسم، يجب حذفهما أولاً", okButtonText: "موافق"});
				} else if((articles.length >2) && (articles.length <11)) {
					alert({title: "تنبيه",message: 'يوجد '  + articles.length + ' مقالات مرتبطة بهذا القسم، يجب حذفهم أولاً', okButtonText: "موافق"});
				} else if(articles.length > 10) {
					alert({title: "تنبيه",message: 'يوجد '  + articles.length + ' مقالة مرتبطة بهذا القسم، يجب حذفهم أولاً', okButtonText: "موافق"});
				}
			} else {
					confirm({
						title: "تأكيد حذف القسم",
						message: "في حال حذف هذا القسم لن تتمكن من استرجاعه",
						okButtonText: "موافق",
						cancelButtonText: "غير موافق",
					}).then(result => {
					if (result) {
						this.firebaseService.deleteCategory(category)
							.catch(() => {
								alert("An error occurred while deleting an item from your list.");
							});
						}
					});
				}
			});
			
		}
		
    viewArticleList(id: string, categoryTitle){
        this.router.navigate(["/list", id, categoryTitle]);
  }

  editCategory(id:string,orderNumberInput:string, updown:boolean){
    let orderNumberInput1: string;
    let orderNumberInput2: string;
    let id2 : string;
    this.firebaseService.queryCategoryList().subscribe(category => {
        
        if (updown){
          category.reverse();
          for (let i:number = 0; i < category.length; i++) { 
              if (parseInt(category[i].orderNumber) > parseInt(orderNumberInput)) {
                  id2 = category[i].id;
                  orderNumberInput2 = category[i].orderNumber;
                  orderNumberInput1 = orderNumberInput;
                  
                  break;
              }
          }
        } else {
          for (let i:number = 0; i < category.length; i++) { 
              if (parseInt(category[i].orderNumber) < parseInt(orderNumberInput)) {
                  id2 = category[i].id;
                  orderNumberInput2 = category[i].orderNumber;
                  orderNumberInput1 = orderNumberInput;
                  break;
              }
          }
        }
          
          if (orderNumberInput2) {
            this.firebaseService.editCategory(id,orderNumberInput2).then((message:any) => {});
          }
          if (orderNumberInput1){
            this.firebaseService.editCategory(id2,orderNumberInput1).then((message:any) => {})
          }
    })
  }

  logout() {
    this.firebaseService.logout();
    this.routerExtensions.navigate(["/login"], { clearHistory: true } );
  }

}