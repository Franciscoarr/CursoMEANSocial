import { Component, DoCheck, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { UserService } from './service/user';
import { UploadService } from './service/upload';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [UserService]
})
export class App implements OnInit, DoCheck {
  public title: string;
  public identity: any;
  public url: string;

  constructor(private _userService:UserService, private _router:Router, private _route:ActivatedRoute, private _uploadService:UploadService){
    this.title = 'NGSOCIAL';
    this.url = this._uploadService.url;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
  }

  ngDoCheck(){
    this.identity = this._userService.getIdentity();
  }

  logout(){
    localStorage.clear();
    this.identity = null;
    this._router.navigate(['/home'])
  }

}
