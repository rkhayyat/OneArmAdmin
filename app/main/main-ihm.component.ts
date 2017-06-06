import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User} from '../models/user.model';
import {FirebaseService} from '../services';
import {Router} from '@angular/router';
import {RouterExtensions} from 'nativescript-angular/router/router-extensions';


@Component({
  moduleId: module.id,
  selector: 'gf-main-ihm',
  templateUrl: 'main-ihm.html'
})
export class MainIhmComponent implements OnInit{
  public message$: Observable<any>;
  constructor(private router: Router, private firebaseService: FirebaseService,private routerExtensions:RouterExtensions) {
 }

ngOnInit(){
    this.message$ = <any>this.firebaseService.getMyMessage();
}

goToArchive(){
    this.router.navigate(["/cat-list"]);
  }

gotToCaf(){
  
    this.router.navigate(["/caf"]);
  }
  
goToAboutUs(){
    this.router.navigate(["/about-us"]);
  }

logout() {
    this.firebaseService.logout();
    this.routerExtensions.navigate(["/login"], { clearHistory: true } );
  }

}
