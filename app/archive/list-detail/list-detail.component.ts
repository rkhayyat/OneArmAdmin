import {Component, OnInit, NgZone} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Router, ActivatedRoute} from '@angular/router';
import {Location} from "@angular/common";
import { BackendService, FirebaseService, UtilsService } from "../../services";
import { Article} from "../../models";
import * as enums from 'ui/enums';
import * as imageSource from 'image-source';
import * as Toast from "nativescript-toast";
import { View } from "ui/core/view";
import * as imagepickerModule from "nativescript-imagepicker";
import * as camera from "nativescript-camera";
import * as fs from "file-system";
import { RouterExtensions } from 'nativescript-angular/router/router-extensions';
// import * as observableData  from 'data/observable';

var imageModule = require("ui/image");
var img;

@Component({
  moduleId: module.id,
  selector: "gf-list-detail",
  templateUrl: "list-detail.html"
})
export class ListDetailComponent implements OnInit {
  
  id: string;
  title: string;
  text: string;
  textHtml: string;
  imagepath: string;
  image: any;
  isLoading:boolean = false;
  searchWord:string;
  private sub: any;
  private imagePath: string;
  private uploadedImageName: string;
  private uploadedImagePath: string;
  public categoryTitle:string;
  public isAnonymous:boolean;
  public list1: any[];
  public isEditing:boolean;
  
  constructor(
        private location: Location,
        private route: ActivatedRoute,
        private router: Router,
        private ngZone: NgZone,
        private firebaseService: FirebaseService,
        private utilsService: UtilsService,
        private routerExtensions:RouterExtensions
    ) {}


 ngOnInit() {

  // this.isLocalImage = false;
  this.isEditing = false;
  this.isAnonymous= BackendService.isAnonymous;
   camera.requestPermissions();
   this.sub = this.route.params.subscribe((params: any) => {
      this.id = params['id'];
      this.categoryTitle = params['categoryTitle'];
      this.searchWord = params['searchWord'];

      this.firebaseService.getMyArticle(this.id).subscribe((article) => {
        this.ngZone.run(() => {
          for (let prop in article) {
            if (prop === "id") {
              this.id = article[prop];
            }
            if (prop === "title") {
              this.title = article[prop];
            }
            if (prop === "text") {

              //let inValid = new RegExp("[\\s]");
              this.text = article[prop];
              this.textHtml = "<span><h5>" + this.text.replace(/\n/g, "<br />")+ "</h5></span>";

              if  (this.searchWord !== "") {
                let regex = new RegExp(this.searchWord, "g");
                this.textHtml =  this.textHtml.replace(regex, "<font color='red'>"+this.searchWord+"</font>");
              }
              


            }
            if (prop === "imagepath") {
              this.imagepath = article[prop];
            }                       
          }
        });
      });
    });  
  }

onEdit(){
  this.isEditing = true;
}
onCancel(){
  this.isEditing = false;
}

onTextViewChange(){
  this.textHtml = "<span><h5>" + this.text.replace(/\n/g, "<br />")+ "</h5></span>";
}

takePhoto() {
  let options = {
            width: 300,
            height: 300,
            keepAspectRatio: true,
            saveToGallery: true
        };
    camera.takePicture(options)
        .then(imageAsset => {
            imageSource.fromAsset(imageAsset).then(res => {
                this.image = res;
                //save the source image to a file, then send that file path to firebase
                this.saveToFile(this.image);
            })
        }).catch(function (err) {
            console.log("Error -> " + err.message);
        });
}

saveToFile(res){
  let imgsrc = res;
        this.imagePath = this.utilsService.documentsPath(`photo-${Date.now()}.png`);
        imgsrc.saveToFile(this.imagePath, enums.ImageFormat.png);       
}

onChangeTextView(){
  this.textHtml = "<span><h1>" + this.text.replace(/\n/g,'<br>') + "</h1></span>";

}

back(){  
  this.location.back();
}
goHome(){
  this.routerExtensions.navigate(["/"], { clearHistory: true } );
}

onSelectSingleTap(){
  var that = this;
  var context = imagepickerModule.create({mode: "single"});

  context
        .authorize()
        .then(function() {
            that.list1 = [];
            return context.present();
        })
        .then(function(selection) {
            selection.forEach(function(selected) {
              // that.isLocalImage = true;
              that.imagePath = selected.fileUri;
              that.image = selected.thumb;
              // this.image
              console.log(selected);
            });           
          }).catch(function (e) {
            console.log(e);
        });
}

editArticle(id: string){
  this.isLoading = true;
  // if((this.image)|| (this.isLocalImage)){
  if (this.image){
    //upload the file, then save all
    this.firebaseService.uploadFile(this.imagePath).then((uploadedFile: any) => {
          this.uploadedImageName = uploadedFile.name;
          //get downloadURL and store it as a full path;
          this.firebaseService.getDownloadUrl(this.uploadedImageName).then((downloadUrl: string) => {
            this.firebaseService.editArticle(id,this.text,downloadUrl).then((result:any) => {
              this.isLoading = false;
              Toast.makeText(result).show();
              this.location.back();
              // alert(result);
            }, (error: any) => {
                alert(error);
            });
          })
        }, (error: any) => {
          alert('File upload error: ' + error);
        });
  }
  else {
    //just edit the description
    this.firebaseService.editDescription(id,this.text).then((result:any) => {
      Toast.makeText(result).show();
      this.location.back();
        // alert(result)
    }, (error: any) => {
        alert(error);
    });
  }    
}
}
