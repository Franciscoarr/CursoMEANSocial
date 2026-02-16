import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publication';
import { UploadService } from '../../service/upload';
import { UserService } from '../../service/user';
import { PublicationService } from '../../service/publication';
import { ChangeDetectorRef } from '@angular/core';
import { Sidebars } from '../sidebars/sidebars';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-timeline',
  imports: [RouterModule, Sidebars],
  templateUrl: './timeline.html',
  styleUrl: './timeline.css',
  providers: [UserService, PublicationService]
})
export class Timeline implements OnInit{
  public identity;
  public token;
  public title: string;
  public url: string;
  public page: any;
  public pages: any;
  public publications: Publication[] = [];
  
  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _uploadService: UploadService, private _publicationService: PublicationService,
    private toast: ToastrService, private cdr: ChangeDetectorRef
  ){
    this.title = 'Timeline';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = this._uploadService.url;
  }

  ngOnInit(){
    this.getPublications(this.page);
  }

  getPublications(page: any){
    this._publicationService.getPublications(this.token, page).subscribe({
      next: (response: any) => {
       if(response.publication){
        this.publications = response.publications;
       } else {
        this.toast.error('Error al mostrar las publicaciones');
       }
      },
      error: error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        this.toast.error('Error al mostrar las publicaciones');
        this.cdr.detectChanges();
      }
    });
  }
}
