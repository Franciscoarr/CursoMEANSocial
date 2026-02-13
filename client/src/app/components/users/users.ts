import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { UserService } from '../../service/user';
import { UploadService } from '../../service/upload';

@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.html',
  styleUrl: './users.css',
  providers: [UserService]
})
export class Users implements OnInit{
  public title: string;
  public identity;
  public token;
  public page: any;
  public next_page: any;
  public prev_page: any;
  public total: any;
  public pages: any;
  public users: User[] = [];

  constructor(private _router: Router, private _route: ActivatedRoute, private _userService: UserService){
    this.title = 'Gente';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    //this.actualPage();
  }

  actualPage(){
    this._route.params.subscribe({
      next: (params) => {
        let page = +params['page']
        this.page = page;

        if(!page){
          page = 1
        }else{
          this.next_page = page+1;
          this.prev_page = page-1;

          if(this.prev_page <= 0){
            this.prev_page = 1;
          }
        }

        // Devolver listado de usuarios
        this.getUsers(page);

      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getUsers(page: any){
    this._userService.getUsers(page).subscribe({
      next: (res:any) => {
        if(res.users){
          this.total = res.total;
          this.users = res.users;
          this.pages = res.pages;
          if(page > this.pages){
            this._router.navigate(['/gente',1]);
          }
        }
      },
      error: (error) => {
        var errorMessage = <any>error;
        console.log(errorMessage);
      }
    });
  }
}