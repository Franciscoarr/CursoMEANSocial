import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../service/user';
import { UploadService } from '../../service/upload';
import { FollowService } from '../../service/follow';
import { ChangeDetectorRef } from '@angular/core';
import { Sidebars } from '../sidebars/sidebars';

@Component({
  selector: 'app-followed',
  imports: [RouterModule, Sidebars],
  templateUrl: './followed.html',
  styleUrl: './followed.css',
  providers: [UserService, FollowService]
})

export class Followed implements OnInit{
  public title: string;
  public identity;
  public token;
  public page: any;
  public next_page: any;
  public prev_page: any;
  public total: any;
  public pages: any;
  public users: User[] = [];
  public follows: any;
  public followed: any;
  public url;
  public userPageId: any;

  constructor(private _router: Router, private _route: ActivatedRoute, private _userService: UserService, private cdr: ChangeDetectorRef,
              private _uploadService: UploadService, private _followService: FollowService){
    this.title = 'Seguidores de ';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = this._uploadService.url;
  }

  ngOnInit(){
      this.actualPage();
  }

  actualPage(){
  this._route.params.subscribe(params => {
    let user_id = params['id'];
    this.userPageId = user_id;
    let page = +params['page'];

    this.page = page;
    this.next_page = page + 1;
    this.prev_page = page > 1 ? page - 1 : 1;

    this.getUser(user_id, page)
  });
}

  getFollows(user_id: any, page: number) {
        this.token = this._userService.getToken();
        if (!this.token) {
            return;
        }
        this._followService.getFollowed(this.token, user_id, page).subscribe({
            next: (response: any) => {

              console.log("RESPUESTA COMPLETA:", response);
              console.log("FOLLOWING:", response.following);
              console.log("USERS_FOLLOWING:", response.users_following);

              if (response.follows) {
                    this.total = response.total;
                    // Filtrar solo los follows válidos
                    this.followed = (response.follows as any[]).filter(u => u.user != null);
                    this.pages = response.pages;
                    this.follows = response.users_following;
 
                    if (page > this.pages) {
                        this._router.navigate(['/']);
                    }
                }
                this.cdr.detectChanges();
            },
            error: error => {
                var errorMessage = <any>error;
                console.log(errorMessage);
                this.cdr.detectChanges();
            }
        });
    }

    public user!: User;
    getUser(user_id: any, page: number){
      this._userService.getUser(user_id).subscribe({
        next: (res: any) => {
          if(res.user){
            this.user = res.user;
            this.getFollows(user_id, page);
            this.cdr.detectChanges();
          } else {
            this._router.navigate(['/home'])
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          var errorMessage = <any>error;
          console.log(errorMessage);
          this.cdr.detectChanges();
        }
      });
    }

    public followUserOver: any;
    mouseEnter(user_id: any){
      this.followUserOver = user_id;
    }

    mouseLeave(user_id: any){
      this.followUserOver = 0;
    }

    followUser(followed: any){
      var follow = new Follow('',this.identity._id, followed);

      this._followService.addFollow(this.token, follow).subscribe({
        next: (res: any) => {
          if(res.follow){
            this.follows.push(followed)
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          var errorMessage = <any>error;
          console.log(errorMessage);
          this.cdr.detectChanges();
        }
      });
    }

    unfollowUser(followed: any){
      this._followService.deleteFollow(this.token, followed).subscribe({
        next: (res: any) => {
          var search = this.follows.indexOf(followed);
          if (search != -1){
            this.follows.splice(search, 1);
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          var errorMessage = <any>error;
          console.log(errorMessage);
          this.cdr.detectChanges();
        }
      });
    }
}