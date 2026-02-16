import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publication';
import { UploadService } from '../../service/upload';
import { UserService } from '../../service/user';
import { ChangeDetectorRef } from '@angular/core';
import { Sidebars } from '../sidebars/sidebars';

@Component({
  selector: 'app-timeline',
  imports: [RouterModule, Sidebars],
  templateUrl: './timeline.html',
  styleUrl: './timeline.css',
  providers: [UserService]
})
export class Timeline implements OnInit{
  public identity;
  public token;
  public title: string;
  public url: string;
  
  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _uploadService: UploadService){
    this.title = 'Timeline';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = this._uploadService.url;
  }

  ngOnInit(){

  }
}
