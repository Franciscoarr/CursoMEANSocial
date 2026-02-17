import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute, Params } from '@angular/router';
import { UploadService } from '../../service/upload';
import { UserService } from '../../service/user';
import { FollowService } from '../../service/follow';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { Sidebars } from '../sidebars/sidebars';

@Component({
  selector: 'app-profile',
  imports: [RouterModule, Sidebars],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  providers: [UserService, FollowService]
})
export class Profile implements OnInit{
  public title: string;
  public user: User[] = [];
  public identity;
  public token;
  public stats: any;
  public url: string;
  public follow: any;
  

  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _uploadService: UploadService, private _followService: FollowService
  ){ 
    this.title = 'Perfil';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = this._uploadService.url;
  }

  ngOnInit(){
    this.loadPage();
  }


  loadPage(){
    this.token = this._userService.getToken();
      if (!this.token) {
          return;
      }
    this._route.params.subscribe(params => {
      let id = params['id'];

      this.getUser(id);
      this.getCounters(id);
    })
  }

  getUser(id: any){
    this._userService.getUser(id).subscribe({
      next: (response: any) => {
        if(response.user){
          this.user = response.user;
        } else {
          this._router.navigate(['/profile', this.identity._id]);
        }
      },
      error: error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        this._router.navigate(['/profile',this.identity._id])
      }
    });
  }

  getCounters(id: any){
    this._userService.getCounters(id).subscribe({
      next: (response: any) => {
        if(response.user){
          this.stats = response;
        }
      },
      error: error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        this._router.navigate(['/profile',this.identity._id])
      }
    });
  }
}
