import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publication';
import { UploadService } from '../../service/upload';
import { UserService } from '../../service/user';
import { PublicationService } from '../../service/publication';
import { ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-publications',
  imports: [RouterModule],
  templateUrl: './publications.html',
  styleUrl: './publications.css',
  standalone: true,
  providers: [UserService, PublicationService]
})
export class Publications implements OnInit{
  public identity;
  public token;
  public title: string;
  public url: string;
  public page: number = 1;
  public pages: any;
  public total: any;
  public itemsPerPage: any;
  public publications: Publication[] = [];
  public noMore = false;
  
  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _uploadService: UploadService, private _publicationService: PublicationService,
    private toast: ToastrService, private cdr: ChangeDetectorRef
  ){
    this.title = 'Publications';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = this._uploadService.url;
  }

  ngOnInit(){
    this._route.params.subscribe(params => {
      this.page = 1;
      this.getPublications(this.page);
    });
  }

  getPublications(page: any, adding = false){
    this.token = this._userService.getToken();
    if (!this.token) {
      return;
    }
    this._publicationService.getPublications(this.token, page).subscribe({
      next: (response: any) => {

       if(response.publications){
        this.total = response.total;
        this.pages = response.pages;
        this.itemsPerPage = response.items_per_page;

        if(!adding){
          this.publications = response.publications;
        } else {
          var arrayA = this.publications;
          var arrayB = response.publications;
          this.publications = arrayA.concat(arrayB)

          $("html, body").animate({ scrollTop: $('body').prop("scrollHeight")}, 500);
        }

        if (this.publications.length >= this.total) {
          this.noMore = true;
        } else {
          this.noMore = false;
        }

        this.cdr.detectChanges();
       } else {
        this.toast.error('No hay más publicaciones que mostrar');
       }
      },
      error: error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        this.toast.error('Has llegado al límite');
        this.cdr.detectChanges();
      }
    });
  }

  viewMore(){
    if(this.publications.length == this.total){
      this.noMore = true;
    } else {
      this.page += 1;
    }
    this.getPublications(this.page, true);
    this.cdr.detectChanges();
  }

  
}
